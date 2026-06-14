import { Link } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";

/** Nút nổi chuyển nhanh giữa 2 bản clone (modern ⇄ classic). */
export function VariantSwitch({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full bg-ink/80 px-4 py-2 text-xs text-white shadow-lg backdrop-blur transition-colors hover:bg-ink"
    >
      <ArrowLeftRight size={14} />
      {label}
    </Link>
  );
}
