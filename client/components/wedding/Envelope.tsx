import { AnimatePresence, motion } from "framer-motion";
import { useEnvelopeStore } from "@/stores/envelopeStore";
import { useMusicStore } from "@/stores/musicStore";
import { Button } from "@/components/ui/button";

/**
 * Overlay "mở thiệp" — 2 cánh trượt sang 2 bên khi bấm. Cú click cũng là
 * user-gesture để bật nhạc nền (vượt chặn autoplay của trình duyệt).
 */
export function Envelope({
  groomName,
  brideName,
  musicEnabled,
}: {
  groomName: string;
  brideName: string;
  musicEnabled: boolean;
}) {
  const opened = useEnvelopeStore((s) => s.opened);
  const open = useEnvelopeStore((s) => s.open);
  const setPlaying = useMusicStore((s) => s.setPlaying);

  const handleOpen = () => {
    open();
    if (musicEnabled) setPlaying(true);
  };

  return (
    <AnimatePresence>
      {!opened && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* 2 cánh */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-primary/90"
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-primary/90"
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
          <div className="relative z-10 text-center text-primary-foreground px-6">
            <p className="font-script text-5xl leading-tight">
              {groomName} &amp; {brideName}
            </p>
            <p className="mt-2 mb-8 text-sm tracking-[0.3em] uppercase opacity-90">
              Save the date
            </p>
            <Button variant="outline" onClick={handleOpen} className="border-white text-white hover:bg-white/10">
              Mở thiệp
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
