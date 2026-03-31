import { useEffect, useRef, useState, useDeferredValue } from 'react';

export function usePerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const framesRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const loop = (time: number) => {
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const currentFps = 1000 / dt;
      framesRef.current.push(currentFps);

      if (framesRef.current.length > 60) {
        framesRef.current.shift();
      }

      if (framesRef.current.length === 60) {
        const avgFps = framesRef.current.reduce((a, b) => a + b, 0) / 60;
        // Throttle updates to avoid state thrashing
        setFps((prev) => {
          if (Math.abs(prev - avgFps) > 3) return Math.round(avgFps);
          return prev;
        });
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const isLowEnd = fps < 55;
  const deferredIsLowEnd = useDeferredValue(isLowEnd);

  return { fps, isLowEnd: deferredIsLowEnd };
}