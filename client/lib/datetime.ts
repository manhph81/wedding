/**
 * Format tất định từ chuỗi ISO có offset (vd "2026-12-20T11:00:00+07:00").
 *
 * Đọc trực tiếp các phần tử trong chuỗi — KHÔNG qua `new Date()`/`toLocale*`
 * (vốn phụ thuộc múi giờ + ICU) → SSG (Node) và client (browser) ra kết quả
 * GIỐNG hệt, tránh lỗi hydration (#423).
 */
function parts(iso: string) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  return { y, mo, d, h, mi };
}

/** "2026-12-20T11:00:00+07:00" → "11:00" */
export function timeFromIso(iso: string): string {
  const p = parts(iso);
  return p ? `${p.h}:${p.mi}` : "";
}

/** "2026-12-20T11:00:00+07:00" → "20/12/2026" */
export function dateFromIso(iso: string): string {
  const p = parts(iso);
  return p ? `${p.d}/${p.mo}/${p.y}` : "";
}
