import { memo } from 'react';
import { motion } from 'motion/react';
import type { CharacterTheme } from '../constants/theme';

interface ECGMonitorProps {
  theme: CharacterTheme | 'default';
  color?: string;
  width?: string;
  height?: string;
}

// Basic Lead II Waveforms mapped to an internal 0-100 ViewBox.
const NSR_PATH = "M 0 50 L 10 50 Q 15 45 20 50 L 30 50 L 35 40 L 40 10 L 45 70 L 50 50 L 60 50 L 70 50 Q 80 35 90 50 L 100 50";
const TACHY_PATH = "M 0 50 L 10 50 Q 12 45 15 50 L 18 50 L 20 40 L 25 10 L 30 70 L 35 50 L 40 50 Q 45 35 50 50 L 55 50 Q 57 45 60 50 L 62 50 L 65 40 L 70 10 L 75 70 L 80 50 L 85 50 Q 90 35 95 50 L 100 50";
const BRADY_PATH = "M 0 50 L 30 50 Q 35 45 40 50 L 45 50 L 50 40 L 55 10 L 60 70 L 65 50 L 75 50 L 100 50";

function ECGMonitorBase({ theme, color = 'var(--primary-color)', width = '100%', height = '60px' }: ECGMonitorProps) {
  let path = NSR_PATH;
  let duration = 1.2;
  
  if (theme === 'teto') {
    path = TACHY_PATH;
    duration = 0.6; // High energy
  } else if (theme === 'neru') {
    path = BRADY_PATH;
    duration = 2.0; // Slow, bored rhythm
  } else if (theme === 'default') {
    color = '#FFFFFF';
  }

  return (
    <div className="relative overflow-hidden flex items-center" style={{ width, height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute top-0 left-0 w-full h-full opacity-80"
        style={{
          WebkitMaskImage: `linear-gradient(to right, transparent, black 10%, black 90%, transparent)`,
          maskImage: `linear-gradient(to right, transparent, black 10%, black 90%, transparent)`
        }}
      >
        <defs>
          <pattern id={`ecg-pattern-${theme}`} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
             <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </pattern>
        </defs>
        
        {/* We make the rect very wide and animate its X to simulate continuous scrolling */}
        <motion.rect 
          x="0" y="0" width="500%" height="100" 
          fill={`url(#ecg-pattern-${theme})`}
          animate={{ x: [0, -100] }}
          transition={{ duration, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* Occasional artifacting (glitch) on Neru simulating a bad connection or interference */}
      {theme === 'neru' && (
        <motion.div 
          className="absolute inset-0 bg-white/20 mix-blend-overlay"
          animate={{ opacity: [0, 0.8, 0, 1, 0, 0] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.15, 0.2, 1] }}
        />
      )}
    </div>
  );
}

export const ECGMonitor = memo(ECGMonitorBase);
