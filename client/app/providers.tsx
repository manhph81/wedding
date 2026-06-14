import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

/**
 * AppProviders — context tree bọc toàn bộ route:
 *  1. QueryClientProvider — server state (React Query: wishes, rsvp).
 *  2. <Toaster />         — render toast (popup lời chúc / feedback).
 *
 * <head> per-route do `<Seo>` (vite-react-ssg `Head`) xử lý, không cần provider.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  // useState initializer → SSG-safe (mỗi pre-render 1 instance, không share cache).
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 30_000 },
          mutations: { retry: 0 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}
