import { query } from "./db/query.js";
import type {
  CreateWishResponse,
  Rsvp,
  RsvpListResponse,
  RsvpResponse,
  Wish,
  WishesResponse,
} from "../shared/api";

/**
 * Logic API dùng chung — gọi được từ cả Express (local dev/Docker) lẫn
 * Vercel serverless functions. Mỗi hàm trả `{ status, body }` để 2 nơi cùng
 * `res.status(status).json(body)`.
 */
export type Result = { status: number; body: unknown };

const fail = (status: number, message: string, message_id: string): Result => ({
  status,
  body: { message, message_id },
});

/* ── Admin auth ── */
const ADMIN_USER = process.env.ADMIN_USER ?? "toibingu";
const ADMIN_PASS = process.env.ADMIN_PASS ?? "toibingu";
const ADMIN_TOKEN = Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString("base64");

export function isAdmin(authHeader: string | undefined): boolean {
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

export function adminLogin(input: unknown): Result {
  const { username, password } = (input ?? {}) as Record<string, unknown>;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return { status: 200, body: { token: ADMIN_TOKEN } };
  }
  return fail(401, "Sai tài khoản hoặc mật khẩu", "MSE_ADMIN_INVALID");
}

/* ── Health ── */
export async function health(): Promise<Result> {
  await query("select 1");
  return { status: 200, body: { ok: true } };
}

/* ── Wishes ── */
export async function listWishes(): Promise<Result> {
  const { rows } = await query<Wish>(
    `select id, name, message, created_at as "createdAt"
       from wishes order by created_at desc`,
  );
  const body: WishesResponse = { wishes: rows };
  return { status: 200, body };
}

export async function createWish(input: unknown): Promise<Result> {
  const { name, message } = (input ?? {}) as Record<string, unknown>;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return fail(400, "Vui lòng nhập tên và lời chúc", "MSE_WISH_BAD_REQUEST");
  }
  const { rows } = await query<Wish>(
    `insert into wishes (name, message) values ($1, $2)
     returning id, name, message, created_at as "createdAt"`,
    [name.trim(), message.trim()],
  );
  const body: CreateWishResponse = { ok: true, wish: rows[0] };
  return { status: 201, body };
}

/* ── RSVP ── */
export async function listRsvps(): Promise<Result> {
  const { rows } = await query<Rsvp>(
    `select id, name, attendance, guests, side, message, created_at as "createdAt"
       from rsvps order by created_at desc`,
  );
  const attending = rows.filter((r) => r.attendance === "yes");
  const body: RsvpListResponse = {
    rsvps: rows,
    stats: {
      attending: attending.length,
      notAttending: rows.length - attending.length,
      totalGuests: attending.reduce((s, r) => s + (r.guests ?? 0), 0),
    },
  };
  return { status: 200, body };
}

export async function createRsvp(input: unknown): Promise<Result> {
  const { name, attendance, guests, side, message } = (input ?? {}) as Record<
    string,
    unknown
  >;
  if (typeof name !== "string" || !name.trim()) {
    return fail(400, "Vui lòng nhập tên", "MSE_RSVP_BAD_REQUEST");
  }
  if (attendance !== "yes" && attendance !== "no") {
    return fail(400, "Lựa chọn tham dự không hợp lệ", "MSE_RSVP_BAD_ATTEND");
  }
  const normalizedSide =
    side === "groom" || side === "bride" || side === "both" ? side : null;
  const { rows } = await query<Rsvp>(
    `insert into rsvps (name, attendance, guests, side, message)
     values ($1, $2, $3, $4, $5)
     returning id, name, attendance, guests, side, message, created_at as "createdAt"`,
    [
      name.trim(),
      attendance,
      Number.isFinite(Number(guests)) ? Number(guests) : 1,
      normalizedSide,
      typeof message === "string" ? message.trim() : null,
    ],
  );
  const body: RsvpResponse = { ok: true, rsvp: rows[0] };
  return { status: 201, body };
}
