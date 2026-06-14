/**
 * Lớp truy vấn DB chọn driver động theo môi trường — KHỞI TẠO LƯỜI:
 *  • URL Neon (`neon.tech`) → `@neondatabase/serverless` (chạy qua HTTP fetch).
 *    An toàn cho Vercel serverless: không TCP/native/require-động → không crash
 *    (FUNCTION_INVOCATION_FAILED).
 *  • Còn lại (local Docker Postgres) → `pg` qua TCP.
 *
 * Dùng dynamic import + lazy → trên Vercel chỉ nạp driver Neon, KHÔNG nạp `pg`.
 */
const connectionString =
  process.env.DATABASE_URL ?? "postgres://wedding:wedding@localhost:5433/wedding";
const isNeon = /neon\.tech/.test(connectionString);

export type QueryResult<T> = { rows: T[] };
type PoolLike = {
  query: (text: string, params?: unknown[]) => Promise<QueryResult<unknown>>;
};

let poolPromise: Promise<PoolLike> | null = null;

function getPool(): Promise<PoolLike> {
  if (!poolPromise) {
    poolPromise = isNeon
      ? import("@neondatabase/serverless").then((neon) => {
          // pool.query() đi qua fetch → không cần WebSocket.
          neon.neonConfig.poolQueryViaFetch = true;
          return new neon.Pool({ connectionString }) as unknown as PoolLike;
        })
      : import("pg").then((mod) => {
          const Pg = ((mod as { default?: unknown }).default ?? mod) as unknown as {
            Pool: new (config: unknown) => PoolLike;
          };
          return new Pg.Pool({
            connectionString,
            max: 10,
            connectionTimeoutMillis: 8000,
          });
        });
  }
  return poolPromise;
}

/** Chạy 1 query, trả `{ rows }` (tương thích cả 2 driver). */
export async function query<T = unknown>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const pool = await getPool();
  return pool.query(text, params) as Promise<QueryResult<T>>;
}
