import { ChevronDown } from "lucide-react";
import type { WeddingConfig } from "@/constants/weddingConfig";

/** Hero full-screen kiểu iWedding — "We're getting married" + Save the date. */
export function ClassicHero({ config }: { config: WeddingConfig }) {
  const { groom, bride } = config.couple;
  const date = new Date(config.weddingDate).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <section
      id="home"
      className="relative flex h-screen min-h-[600px] items-center justify-center text-center"
    >
      <img
        src={config.hero.coverPhoto}
        alt={`${groom.name} & ${bride.name}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 px-6 text-white">
        <p className="text-sm uppercase tracking-[0.4em]">
          We&apos;re getting married
        </p>
        <h1 className="my-6 font-script text-6xl leading-tight drop-shadow-lg md:text-8xl">
          {groom.name} &amp; {bride.name}
        </h1>
        <p className="inline-block border-y border-white/60 px-6 py-2 text-sm tracking-[0.3em]">
          SAVE THE DATE • {date}
        </p>
      </div>
      <a
        href="#couple"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/80"
        aria-label="Cuộn xuống"
      >
        <ChevronDown className="animate-bounce" />
      </a>
    </section>
  );
}
