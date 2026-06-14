import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Section, SectionTitle } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import type { WeddingEvent } from "@/constants/weddingConfig";

/** Sự kiện cưới — giờ, ngày dương/âm, địa điểm, chỉ đường. */
export function Events({ events }: { events: WeddingEvent[] }) {
  return (
    <Section id="events">
      <SectionTitle eyebrow="When & where" title="Sự kiện cưới" />
      <div className="space-y-6">
        {events.map((e, i) => (
          <div
            key={i}
            className="rounded-card border border-border bg-surface p-5 text-center shadow-sm"
          >
            <p className="font-serif text-lg text-primary">{e.title}</p>
            <div className="mt-3 space-y-1.5 text-sm text-ink">
              <p className="flex items-center justify-center gap-2">
                <CalendarDays size={15} className="text-gold" />
                {e.solarDate}
                {e.lunarDate && (
                  <span className="text-muted">({e.lunarDate})</span>
                )}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Clock size={15} className="text-gold" />
                {new Date(e.datetime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="flex items-center justify-center gap-2">
                <MapPin size={15} className="text-gold" />
                {e.venue}
              </p>
              <p className="text-muted">{e.address}</p>
            </div>
            {e.mapUrl && (
              <a href={e.mapUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="mt-4">
                  Xem bản đồ
                </Button>
              </a>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
