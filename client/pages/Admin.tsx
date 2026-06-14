import { useEffect, useState } from "react";
import { Check, LogOut, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminLogin, useRsvpList } from "@/hooks/useRsvp";
import {
  clearAdminToken,
  getAdminToken,
  setAdminToken,
} from "@/lib/adminAuth";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

const SIDE_LABEL: Record<string, string> = {
  groom: "Nhà trai",
  bride: "Nhà gái",
  both: "Cả hai",
};

/** Form đăng nhập admin. */
function LoginGate({ onLoggedIn }: { onLoggedIn: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useAdminLogin();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { username, password },
      {
        onSuccess: (res) => {
          setAdminToken(res.token);
          onLoggedIn(res.token);
        },
        onError: (err) =>
          toast.error(
            err instanceof ApiError && err.message
              ? err.message
              : "Đăng nhập thất bại, vui lòng thử lại",
          ),
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-card border border-border bg-surface p-6 shadow-sm"
      >
        <h1 className="font-serif text-xl text-ink">Đăng nhập Admin</h1>
        <p className="mb-5 mt-1 text-sm text-muted">
          Khu vực quản lý danh sách tham dự.
        </p>
        <div className="space-y-3">
          <Input
            placeholder="Tài khoản"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-sm">
      <div className={cn("mb-2 inline-flex rounded-full p-2", className)}>{icon}</div>
      <div className="font-serif text-3xl text-ink tabular-nums">{value}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}

/** Admin dashboard — đăng nhập (toibingu/toibingu) → xem danh sách RSVP + thống kê. */
export default function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Đọc token từ localStorage sau mount (tránh hydration mismatch ở SSG).
  useEffect(() => {
    setToken(getAdminToken());
    setReady(true);
  }, []);

  const { data, isLoading, error } = useRsvpList(token);

  // Token hết hạn / sai → đăng xuất.
  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      clearAdminToken();
      setToken(null);
      toast.error("Phiên đăng nhập đã hết, vui lòng đăng nhập lại");
    }
  }, [error]);

  const logout = () => {
    clearAdminToken();
    setToken(null);
  };

  if (!ready) return null;
  if (!token)
    return (
      <>
        <Seo title="Admin • Đăng nhập" description="Quản lý RSVP" noindex />
        <LoginGate onLoggedIn={setToken} />
      </>
    );

  return (
    <div className="min-h-screen bg-bg">
      <Seo title="Admin • Danh sách tham dự" description="Quản lý RSVP" noindex />

      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-ink">
              Danh sách xác nhận tham dự
            </h1>
            <p className="mt-1 text-sm text-muted">
              Tổng hợp phản hồi RSVP của khách mời.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut size={15} /> Đăng xuất
          </Button>
        </div>

        {isLoading && <p className="mt-8 text-muted">Đang tải...</p>}

        {data && (
          <>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <StatCard
                icon={<Check size={18} className="text-green-700" />}
                label="Sẽ tham dự"
                value={data.stats.attending}
                className="bg-green-100"
              />
              <StatCard
                icon={<X size={18} className="text-red-700" />}
                label="Không tham dự"
                value={data.stats.notAttending}
                className="bg-red-100"
              />
              <StatCard
                icon={<Users size={18} className="text-primary" />}
                label="Tổng số khách"
                value={data.stats.totalGuests}
                className="bg-primary/10"
              />
            </div>

            <div className="mt-8 overflow-x-auto rounded-card border border-border bg-surface shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-primary/5 text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Tên</th>
                    <th className="px-4 py-3 font-medium">Tham dự</th>
                    <th className="px-4 py-3 font-medium">Số khách</th>
                    <th className="px-4 py-3 font-medium">Bên</th>
                    <th className="px-4 py-3 font-medium">Lời nhắn</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rsvps.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted">
                        Chưa có ai xác nhận.
                      </td>
                    </tr>
                  )}
                  {data.rsvps.map((r) => (
                    <tr key={r.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-block rounded-full px-2.5 py-0.5 text-xs",
                            r.attendance === "yes"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700",
                          )}
                        >
                          {r.attendance === "yes" ? "Có" : "Không"}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums">{r.guests}</td>
                      <td className="px-4 py-3 text-muted">
                        {r.side ? SIDE_LABEL[r.side] : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted">{r.message || "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted">
                        {new Date(r.createdAt).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
