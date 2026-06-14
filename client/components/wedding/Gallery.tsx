import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Section, SectionTitle } from "@/components/ui/section";

/** Album ảnh cưới — lưới + lightbox (Framer Motion). */
export function Gallery({ photos }: { photos: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Section id="gallery" className="bg-primary/5">
      <SectionTitle eyebrow="Memories" title="Album hình cưới" />
      <div className="grid grid-cols-2 gap-2">
        {photos.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(src)}
            className="aspect-[3/4] overflow-hidden rounded-xl"
          >
            <img
              src={src}
              alt={`Ảnh cưới ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              aria-label="Đóng"
              className="absolute right-4 top-4 text-white"
            >
              <X size={28} />
            </button>
            <motion.img
              src={active}
              alt="Ảnh cưới"
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
