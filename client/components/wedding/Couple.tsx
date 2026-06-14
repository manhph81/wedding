import { Section, SectionTitle } from "@/components/ui/section";
import type { Person } from "@/constants/weddingConfig";

function PersonCard({ person }: { person: Person }) {
  return (
    <div className="text-center">
      <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-gold/40 shadow-md">
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
      {person.bio && <p className="mt-2 text-sm text-muted px-4">{person.bio}</p>}
      {person.parents && (
        <p className="mt-3 text-xs text-muted">
          {person.parents.father} <br /> {person.parents.mother}
        </p>
      )}
    </div>
  );
}

/** Giới thiệu cô dâu – chú rể. */
export function Couple({
  groom,
  bride,
}: {
  groom: Person;
  bride: Person;
}) {
  return (
    <Section id="couple">
      <SectionTitle eyebrow="Happy couple" title="Cô dâu & Chú rể" />
      <div className="space-y-10">
        <PersonCard person={groom} />
        <div className="text-center font-script text-5xl text-rose">&amp;</div>
        <PersonCard person={bride} />
      </div>
    </Section>
  );
}
