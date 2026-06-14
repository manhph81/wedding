import { useSearchParams } from "react-router-dom";

/**
 * Tên khách cá nhân hoá từ query param `?guest=Tên+Khách`.
 * Link riêng mỗi khách → "Trân trọng kính mời: <Tên>".
 */
export function useGuestName(): string | null {
  const [params] = useSearchParams();
  const g = params.get("guest");
  return g && g.trim() ? g.trim() : null;
}
