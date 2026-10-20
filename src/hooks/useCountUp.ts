import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Returns the current display value (integer).
 */
export function useCountUp(target: number, duration = 900, trigger = true): number {
  const [value, setValue] = useState(0);
  const frame  = useRef<number | null>(null);
  const start  = useRef<number | null>(null);
  const from   = useRef(0);

  useEffect(() => {
    if (!trigger) return;
    from.current = 0;
    start.current = null;

    const step = (timestamp: number) => {
      if (!start.current) start.current = timestamp;
      const elapsed  = timestamp - start.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from.current + (target - from.current) * eased));
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };

    frame.current = requestAnimationFrame(step);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
  }, [target, duration, trigger]);

  return value;
}
