import { memo, useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import type { CharacterTheme } from '../constants/theme';

interface HeartRateMonitorProps {
  theme: CharacterTheme | 'default';
  analyserNode: AnalyserNode | null;
  color?: string;
  width?: string;
  height?: string;
}

const WAVES = {
  miku: {
    path: "M 0 50 L 10 50 Q 15 45 20 50 L 30 50 L 35 40 L 40 10 L 45 70 L 50 50 L 60 50 L 70 50 Q 80 35 90 50 L 100 50",
    bpm: 75,
  },
  teto: {
    path: "M 0 50 L 10 50 Q 12 45 15 50 L 18 50 L 20 40 L 25 10 L 30 70 L 35 50 L 40 50 Q 45 35 50 50 L 55 50 Q 57 45 60 50 L 62 50 L 65 40 L 70 10 L 75 70 L 80 50 L 85 50 Q 90 35 95 50 L 100 50",
    bpm: 120, // Tachycardic
  },
  neru: {
    path: "M 0 50 L 30 50 Q 35 45 40 50 L 45 50 L 50 40 L 55 10 L 60 70 L 65 50 L 75 50 L 100 50", // Bradycardic, wide
    bpm: 55,
  },
  default: {
    path: "M 0 50 L 10 50 Q 15 45 20 50 L 30 50 L 35 40 L 40 10 L 45 70 L 50 50 L 60 50 L 70 50 Q 80 35 90 50 L 100 50",
    bpm: 75,
  }
};

function HeartRateMonitorBase({ theme, analyserNode, color = '#39C5BB', width = '100%', height = '60px' }: HeartRateMonitorProps) {
  const t = theme === 'default' ? 'miku' : theme;
  const config = WAVES[t];
  
  const pathRef = useRef<SVGPathElement>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const dashOffset = useMotionValue(0);

  useEffect(() => {
    if (analyserNode) {
      dataArray.current = new Uint8Array(analyserNode.frequencyBinCount);
    }
  }, [analyserNode]);

  useAnimationFrame(() => {
    // Determine speed based on BPM
    const speed = (config.bpm / 60) * 100; // units per second
    
    let bump = 0;
    if (analyserNode && dataArray.current) {
      analyserNode.getByteFrequencyData(dataArray.current as any);
      // Sample bass frequency
      const bass = (dataArray.current[2] + dataArray.current[3] + dataArray.current[4]) / 3;
      // Kick transient -> skip ahead slightly
      if (bass > 200) bump = (bass / 255) * 5; 
    }

    // Scroll leftwards
    dashOffset.set(dashOffset.get() - (speed / 60) - bump);
  });

  return (
    <div className="relative overflow-hidden flex items-center justify-center p-2" style={{ width, height }}>
       <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full opacity-90 drop-shadow-[0_0_8px_currentColor]"
        style={{ color }}
      >
        <defs>
          <pattern id={`heartrate-pattern-${t}`} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
             <motion.path 
               ref={pathRef}
               d={config.path} 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2.5" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
             />
          </pattern>
        </defs>

        <motion.rect
          x="0" y="0" width="500%" height="100"
          fill={`url(#heartrate-pattern-${t})`}
          style={{ x: dashOffset }}
        />
      </svg>
    </div>
  );
}

// React 19 Custom Comparison per prompt constraints
export const HeartRateMonitor = memo(HeartRateMonitorBase, (prev, next) => {
  return prev.theme === next.theme && prev.width === next.width && prev.height === next.height;
});