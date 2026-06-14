import { cn } from "@/lib/utils";

/** Wrapper section chuẩn — padding dọc + id để điều hướng/anchor. */
export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("px-5 py-12", className)}>
      {children}
    </section>
  );
}

/** Tiêu đề section: eyebrow (script) + heading (serif). */
export function SectionTitle({
  eyebrow,
  title,
  className,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center mb-8", className)}>
      {eyebrow && (
        <p className="font-script text-3xl text-primary leading-tight">{eyebrow}</p>
      )}
      <h2 className="font-serif text-2xl tracking-wide text-ink uppercase">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-px w-16 bg-gold" />
    </div>
  );
}
