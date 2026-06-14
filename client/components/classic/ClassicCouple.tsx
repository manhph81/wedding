import { Section, SectionTitle } from "@/components/ui/section";
import type { Person } from "@/constants/weddingConfig";

function Card({ person }: { person: Person }) {
  return (
    <div className="text-center">
      <div className="mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-card shadow-md">
        <img
          src={person.photo}
          alt={person.fullName}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-4 text-xs uppercase tracking-widest text-gold">
        {person.role === "groom" ? "Chú rể" : "Cô dâu"}
      </p>
      <h3 className="font-script text-4xl text-primary leading-tight">
        {person.name}
      </h3>
      <p className="text-sm text-ink">{person.fullName}</p>
      {person.bio && <p className="mt-2 text-sm text-muted">{person.bio}</p>}
      {person.parents && (
        <p className="mt-3 text-xs text-muted">
          {person.parents.father} <br /> {person.parents.mother}
        </p>
      )}
    </div>
  );
}

/** Giới thiệu cặp đôi — 2 cột song song trên desktop (khác bản modern xếp dọc). */
export function ClassicCouple({
  groom,
  bride,
}: {
  groom: Person;
  bride: Person;
}) {
  return (
    <Section id="couple">
      <SectionTitle eyebrow="Happy couple" title="Cô dâu & Chú rể" />
      <div className="grid items-start gap-10 md:grid-cols-[1fr_auto_1fr]">
        <Card person={groom} />
        <div className="hidden items-center justify-center font-script text-6xl text-rose md:flex">
          &amp;
        </div>
        <Card person={bride} />
      </div>
    </Section>
  );
}
