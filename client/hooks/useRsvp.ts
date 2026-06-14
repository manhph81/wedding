import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { API_PATHS } from "@/constants/apiPaths";
import type {
  AdminLoginInput,
  AdminLoginResponse,
  RsvpInput,
  RsvpListResponse,
  RsvpResponse,
} from "@shared/api";

/** Gửi xác nhận tham dự. */
export function useRsvp() {
  return useMutation({
    mutationFn: (input: RsvpInput) =>
      api.post<RsvpResponse>(API_PATHS.rsvp, input),
  });
}

/** Đăng nhập admin → token. */
export function useAdminLogin() {
  return useMutation({
    mutationFn: (input: AdminLoginInput) =>
      api.post<AdminLoginResponse>(API_PATHS.adminLogin, input),
  });
}

/** Danh sách RSVP + thống kê (admin) — gửi Bearer token; chỉ chạy khi có token. */
export function useRsvpList(token: string | null) {
  return useQuery({
    queryKey: ["rsvp-list", token],
    enabled: !!token,
    retry: false,
    queryFn: () =>
      api.get<RsvpListResponse>(API_PATHS.rsvp, {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });
}
