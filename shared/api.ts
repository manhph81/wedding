/** Types share giữa client + server. */

export type HealthResponse = { ok: true };

/** Error envelope từ server — client `ApiError` parse field này. */
export type ApiErrorBody = {
  message: string;
  message_id?: string;
  [key: string]: unknown;
};

/* ─────────────────────────────  RSVP  ───────────────────────────── */

export type RsvpAttendance = "yes" | "no";

/** Payload form xác nhận tham dự gửi lên server. */
export type RsvpInput = {
  name: string;
  attendance: RsvpAttendance;
  /** Số người đi cùng (gồm khách chính). */
  guests: number;
  /** Bên dự: nhà trai / nhà gái / cả hai. */
  side?: "groom" | "bride" | "both";
  message?: string;
};

export type Rsvp = RsvpInput & { id: string; createdAt: string };

export type RsvpResponse = { ok: true; rsvp: Rsvp };

/** Danh sách RSVP + thống kê (admin dashboard). */
export type RsvpStats = {
  attending: number;
  notAttending: number;
  /** Tổng số khách (cộng `guests` của các phiếu tham dự). */
  totalGuests: number;
};
export type RsvpListResponse = { rsvps: Rsvp[]; stats: RsvpStats };

/* ────────────────────────────  Admin auth  ──────────────────────────── */

export type AdminLoginInput = { username: string; password: string };
export type AdminLoginResponse = { token: string };

/* ────────────────────────────  Wishes  ──────────────────────────── */

/** Lời chúc (sổ lưu bút). */
export type WishInput = {
  name: string;
  message: string;
};

export type Wish = WishInput & { id: string; createdAt: string };

export type WishesResponse = { wishes: Wish[] };
export type CreateWishResponse = { ok: true; wish: Wish };
