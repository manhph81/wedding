import { create } from "zustand";

/** Đã mở thiệp chưa — điều khiển overlay phong bì + kích hoạt nhạc/scroll. */
type EnvelopeState = {
  opened: boolean;
  open: () => void;
};

export const useEnvelopeStore = create<EnvelopeState>((set) => ({
  opened: false,
  open: () => set({ opened: true }),
}));
