import { create } from "zustand";

/** State nhạc nền — chia sẻ giữa MusicPlayer (nút nổi) và Envelope (mở thiệp → play). */
type MusicState = {
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  toggle: () => void;
};

export const useMusicStore = create<MusicState>((set) => ({
  playing: false,
  setPlaying: (playing) => set({ playing }),
  toggle: () => set((s) => ({ playing: !s.playing })),
}));
