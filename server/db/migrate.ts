import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

/**
 * Migration runner — áp dụng tuần tự các file `.sql` trong `db/migrations`,
 * ghi version đã chạy vào bảng `schema_migrations` (idempotent: chạy lại chỉ
 * áp dụng file mới). Mỗi file chạy trong 1 transaction.
 *
 * Usage: `pnpm migrate` (cần DATABASE_URL trỏ tới Postgres).
 */
const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "../../db/migrations");

async function main() {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgres://wedding:wedding@localhost:5433/wedding";
  const client = new Client({ connectionString });
  await client.connect();
  console.log(`[migrate] connected → ${connectionString.replace(/:[^:@/]+@/, ":***@")}`);

  await client.query(
    `create table if not exists schema_migrations (
       version    text        primary key,
       applied_at timestamptz not null default now()
     )`,
  );

  const applied = new Set(
    (await client.query<{ version: string }>("select version from schema_migrations")).rows.map(
      (r) => r.version,
    ),
  );

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`[migrate] = skip   ${file}`);
      continue;
    }
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    console.log(`[migrate] + apply  ${file}`);
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into schema_migrations(version) values($1)", [file]);
      await client.query("commit");
      count++;
    } catch (err) {
      await client.query("rollback");
      console.error(`[migrate] ! failed ${file}:`, err);
      await client.end();
      process.exit(1);
    }
  }

  console.log(`[migrate] done — applied ${count}, total ${files.length}`);
  await client.end();
}

main().catch((err) => {
  console.error("[migrate] fatal", err);
  process.exit(1);
});
