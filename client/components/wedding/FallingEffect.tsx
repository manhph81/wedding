import { useEffect, useState } from "react";

/**
 * Hiệu ứng rơi (tim/cánh hoa) phủ toàn màn — cấu hình màu/mật độ/tốc độ.
 * Chỉ render sau mount (tránh SSG DOM nặng) + tôn trọng prefers-reduced-motion
 * (CSS trong global.css đã tắt animation khi user yêu cầu).
 */
export function FallingEffect({
  color,
  density,
  speed,
}: {
  color: string;
  density: number;
  speed: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const items = Array.from({ length: density });
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden>
      {items.map((_, i) => {
        const left = (i * 97) % 100; // phân bố ngang ổn định
        const delay = (i % 10) * 0.7;
        const duration = speed + (i % 5);
        const size = 10 + (i % 4) * 4;
        return (
          <span
            key={i}
            className="absolute top-0 animate-fall"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
