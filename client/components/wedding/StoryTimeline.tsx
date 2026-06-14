import { motion } from "framer-motion";
import { Section, SectionTitle } from "@/components/ui/section";
import type { StoryMilestone } from "@/constants/weddingConfig";

/** Chuyện tình yêu — timeline các mốc kỷ niệm. */
export function StoryTimeline({ story }: { story: StoryMilestone[] }) {
  return (
    <Section id="story" className="bg-primary/5">
      <SectionTitle eyebrow="Our story" title="Chuyện tình yêu" />
      <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-gold/40">
        {story.map((m, i) => (
          <motion.div
            key={i}
            className="relative pl-12"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            <span className="absolute left-[9px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/15" />
            <p className="text-xs uppercase tracking-widest text-gold">{m.date}</p>
            <h3 className="font-serif text-lg text-ink">{m.title}</h3>
            {m.photo && (
              <img
                src={m.photo}
                alt={m.title}
                className="my-3 w-full rounded-card object-cover shadow-sm"
              />
            )}
            <p className="text-sm text-muted">{m.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
