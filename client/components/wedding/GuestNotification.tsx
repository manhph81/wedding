import { useEffect } from "react";
import { toast } from "sonner";
import { useWishes } from "@/hooks/useWishes";

/** Popup thông báo lời chúc gần đây (toast nhỏ, 5s/lần) — chỉ chạy client. */
export function GuestNotification({ enabled }: { enabled: boolean }) {
  const { data } = useWishes();

  useEffect(() => {
    if (!enabled || !data?.wishes.length) return;
    let i = 0;
    const id = setInterval(() => {
      const w = data.wishes[i % data.wishes.length];
      toast(`💌 ${w.name}`, { description: w.message, duration: 4000 });
      i++;
    }, 9000);
    return () => clearInterval(id);
  }, [enabled, data]);

  return null;
}
