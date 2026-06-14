import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS: [string, string][] = [
  ["#home", "Trang chủ"],
  ["#couple", "Cô dâu & Chú rể"],
  ["#story", "Chuyện tình"],
  ["#events", "Sự kiện"],
  ["#gallery", "Album"],
  ["#wishes", "Lời chúc"],
  ["#rsvp", "RSVP"],
];

/** Thanh điều hướng cố định kiểu iWedding — trong suốt trên hero, đặc khi cuộn. */
export function Navbar({ initials }: { initials: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors",
        scrolled ? "bg-surface/95 shadow-sm backdrop-blur" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <a
          href="#home"
          className={cn(
            "font-serif text-xl tracking-widest",
            scrolled ? "text-primary" : "text-white",
          )}
        >
          {initials}
        </a>

        {/* Desktop menu */}
        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className={cn(
                  "text-sm transition-colors hover:text-gold",
                  scrolled ? "text-ink" : "text-white/90",
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className={cn("md:hidden", scrolled ? "text-ink" : "text-white")}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <ul className="space-y-1 border-t border-border bg-surface px-5 py-3 md:hidden">
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-ink hover:text-primary"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
