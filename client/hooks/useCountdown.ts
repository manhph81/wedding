import { useEffect, useState } from "react";

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function diff(target: number): Countdown {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    done: ms === 0,
  };
}

/** Đếm ngược tới `isoDate`. Tick mỗi giây (chỉ chạy client). */
export function useCountdown(isoDate: string): Countdown {
  const target = new Date(isoDate).getTime();
  const [state, setState] = useState<Countdown>(() => diff(target));

  useEffect(() => {
    setState(diff(target));
    const id = setInterval(() => setState(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return state;
}
