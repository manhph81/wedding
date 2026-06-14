import { useEffect, useRef } from "react";
import { Music, Pause } from "lucide-react";
import { useMusicStore } from "@/stores/musicStore";
import { cn } from "@/lib/utils";

/** Nút nhạc nền nổi góc màn — đồng bộ với musicStore (Envelope kích hoạt play). */
export function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playing = useMusicStore((s) => s.playing);
  const setPlaying = useMusicStore((s) => s.setPlaying);
  const toggle = useMusicStore((s) => s.toggle);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.play().catch(() => setPlaying(false)); // autoplay bị chặn → revert
    } else {
      el.pause();
    }
  }, [playing, setPlaying]);

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
        className={cn(
          "fixed bottom-5 right-5 z-30 grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105",
          playing && "animate-spin [animation-duration:6s]",
        )}
      >
        {playing ? <Pause size={18} /> : <Music size={18} />}
      </button>
    </>
  );
}
