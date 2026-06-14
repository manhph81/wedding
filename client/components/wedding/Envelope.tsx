import { AnimatePresence, motion } from "framer-motion";
import { Hand } from "lucide-react";
import { useEnvelopeStore } from "@/stores/envelopeStore";
import { useMusicStore } from "@/stores/musicStore";

/** Hình thiệp/phong bì (SVG) — phong bì kem, viền vàng, dấu niêm trái tim. */
function EnvelopeArt() {
  return (
    <svg width="180" height="132" viewBox="0 0 180 132" className="drop-shadow-2xl">
      {/* thân phong bì */}
      <rect x="6" y="18" width="168" height="108" rx="10" fill="#FFF8EF" stroke="#C9A86A" strokeWidth="2" />
      {/* mép gấp dưới */}
      <path d="M6 28 L90 86 L174 28" fill="none" stroke="#E3CFA6" strokeWidth="2" />
      <path d="M6 126 L72 78 M174 126 L108 78" stroke="#E3CFA6" strokeWidth="2" />
      {/* nắp phong bì (đóng) */}
      <path d="M6 24 L90 84 L174 24 L174 20 Q174 12 166 12 L14 12 Q6 12 6 20 Z" fill="#F5E7CE" stroke="#C9A86A" strokeWidth="2" />
      {/* dấu niêm trái tim */}
      <circle cx="90" cy="58" r="18" fill="#965D5D" />
      <path d="M90 66 l-7-6.4c-2.6-2.3-4.3-3.8-4.3-5.7 0-1.55 1.2-2.7 2.75-2.7 0.87 0 1.7 0.4 2.25 1.04 0.55-0.64 1.38-1.04 2.25-1.04 1.55 0 2.75 1.15 2.75 2.7 0 1.9-1.7 3.4-4.3 5.7z" fill="#FFF8EF" transform="translate(0 -1)" />
    </svg>
  );
}

/**
 * Overlay "mở thiệp" giống mehappy — ảnh nền + hình phong bì + icon bàn tay
 * nhấp nháy hướng dẫn chạm. Click cũng là user-gesture để bật nhạc nền.
 */
export function Envelope({
  groomName,
  brideName,
  coverPhoto,
  musicEnabled,
}: {
  groomName: string;
  brideName: string;
  coverPhoto: string;
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
          className="fixed inset-0 z-50 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Ảnh nền + lớp tối */}
          <img
            src={coverPhoto}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />

          {/* 2 cánh trượt ra khi mở (hiệu ứng vén màn) */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-primary/40 backdrop-blur-[1px]"
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-primary/40 backdrop-blur-[1px]"
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          {/* Nội dung giữa */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <p className="text-xs uppercase tracking-[0.4em] opacity-90">
              Wedding Invitation
            </p>
            <p className="my-4 font-script text-5xl leading-tight drop-shadow-lg">
              {groomName} &amp; {brideName}
            </p>

            <button
              type="button"
              onClick={handleOpen}
              aria-label="Mở thiệp"
              className="relative mt-2 outline-none"
            >
              {/* phong bì nổi nhẹ */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <EnvelopeArt />
              </motion.div>

              {/* icon bàn tay nhấp nháy hướng dẫn chạm */}
              <motion.span
                className="absolute -bottom-3 right-6 text-white"
                animate={{ y: [0, 10, 0], scale: [1, 0.88, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Hand size={40} className="drop-shadow-lg" />
              </motion.span>
            </button>

            <motion.p
              className="mt-8 text-sm tracking-[0.25em]"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              CHẠM ĐỂ MỞ THIỆP
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
