import { useEffect, useRef } from 'react';

export function useResizeObserver(
  callback: (width: number, height: number) => void
) {
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    observerRef.current = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        callback(width, height);
      }
    });

    observerRef.current.observe(document.documentElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback]);
}
