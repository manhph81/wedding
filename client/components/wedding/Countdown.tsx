import { useEffect, useState } from "react";
import { Section, SectionTitle } from "@/components/ui/section";
import { useCountdown } from "@/hooks/useCountdown";

/** Đếm ngược tới ngày cưới. Chỉ render số sau mount → tránh hydration mismatch. */
export function Countdown({ date }: { date: string }) {
  const c = useCountdown(date);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cells: [string, number][] = [
    ["Ngày", c.days],
    ["Giờ", c.hours],
    ["Phút", c.minutes],
    ["Giây", c.seconds],
  ];

  return (
    <Section id="countdown" className="bg-primary/5">
      <SectionTitle eyebrow="Save the date" title="Đếm ngược" />
      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
        {cells.map(([label, value]) => (
          <div
            key={label}
            className="rounded-card bg-surface py-4 text-center shadow-sm"
          >
            <div className="font-serif text-3xl text-primary tabular-nums">
              {mounted ? String(value).padStart(2, "0") : "--"}
            </div>
            <div className="text-xs text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
