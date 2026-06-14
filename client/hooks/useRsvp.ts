import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { API_PATHS } from "@/constants/apiPaths";
import type { RsvpInput, RsvpResponse } from "@shared/api";

/** Gửi xác nhận tham dự. */
export function useRsvp() {
  return useMutation({
    mutationFn: (input: RsvpInput) =>
      api.post<RsvpResponse>(API_PATHS.rsvp, input),
  });
}
