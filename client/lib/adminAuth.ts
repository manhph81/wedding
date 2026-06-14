/** Lưu token admin trong localStorage (guard SSG: không có localStorage trên server). */
const KEY = "wedding_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}
