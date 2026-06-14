import { Section } from "@/components/ui/section";
import { useGuestName } from "@/hooks/useGuestName";

/** Lời mời + tên khách cá nhân hoá (nếu có `?guest=`). */
export function Invitation({ greeting }: { greeting: string }) {
  const guest = useGuestName();
  return (
    <Section id="invitation" className="text-center">
      <p className="font-serif text-lg uppercase tracking-[0.2em] text-gold">
        {greeting}
      </p>
      {guest && (
        <p className="mt-3 font-script text-4xl text-primary leading-tight">
          {guest}
        </p>
      )}
      <p className="mx-auto mt-4 max-w-xs text-sm text-muted">
        Đến chung vui cùng gia đình chúng tôi trong ngày lễ thành hôn.
      </p>
    </Section>
  );
}
