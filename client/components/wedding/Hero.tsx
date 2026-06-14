import { motion } from "framer-motion";
import type { WeddingConfig } from "@/constants/weddingConfig";

/** Bìa thiệp — ảnh cover + tên cặp đôi (font script) + tagline. */
export function Hero({ config }: { config: WeddingConfig }) {
  const { groom, bride } = config.couple;
  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
      <img
        src={config.hero.coverPhoto}
        alt={`${groom.name} & ${bride.name}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      <motion.div
        className="absolute inset-x-0 bottom-16 text-center text-white px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-xs tracking-[0.4em] uppercase opacity-90">
          {config.hero.tagline}
        </p>
        <h1 className="font-script text-6xl leading-tight drop-shadow-lg mt-3">
          {groom.name}
          <span className="block text-4xl my-1">&amp;</span>
          {bride.name}
        </h1>
      </motion.div>
    </section>
  );
}
