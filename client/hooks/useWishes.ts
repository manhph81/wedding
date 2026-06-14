import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { API_PATHS } from "@/constants/apiPaths";
import type {
  CreateWishResponse,
  WishesResponse,
  WishInput,
} from "@shared/api";

const KEY = ["wishes"];

/** Danh sách lời chúc (sổ lưu bút). */
export function useWishes() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api.get<WishesResponse>(API_PATHS.wishes),
  });
}

/** Gửi lời chúc mới → invalidate danh sách. */
export function useCreateWish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: WishInput) =>
      api.post<CreateWishResponse>(API_PATHS.wishes, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
