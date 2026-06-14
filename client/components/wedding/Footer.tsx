import type { WeddingConfig } from "@/constants/weddingConfig";

export function Footer({ config }: { config: WeddingConfig }) {
  const { groom, bride } = config.couple;
  return (
    <footer className="bg-primary py-10 text-center text-primary-foreground">
      <p className="font-script text-4xl leading-tight">
        {groom.name} &amp; {bride.name}
      </p>
      <p className="mt-2 text-xs tracking-widest uppercase opacity-80">
        Thank you for being part of our story
      </p>
    </footer>
  );
}
