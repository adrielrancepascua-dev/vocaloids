"use client";
import { useEffect, useState, memo } from 'react';
import { motion } from 'motion/react';
import { vocaloidData } from '../config/vocaloidData';
import { ECGMonitor } from './ECGMonitor';

interface LoadingScreenProps {
  onLoadComplete: () => Promise<void> | void;
  onStartExperience: () => Promise<void>;
}

const ASSETS_TO_LOAD = vocaloidData.flatMap((v) => [
  { type: 'image' as const, name: `${v.theme}-base`, src: v.baseImage },
  { type: 'image' as const, name: `${v.theme}-bg`, src: v.bgImage },
  { type: 'audio' as const, name: `${v.theme}-audio`, src: v.audioSrc },
]);

function LoadingScreenBase({ onLoadComplete, onStartExperience }: LoadingScreenProps) {
  const [loadedAssets, setLoadedAssets] = useState<Set<string>>(new Set());
  const [hasStarted, setHasStarted] = useState(false);

  const totalAssets = ASSETS_TO_LOAD.length;
  const loadedCount = loadedAssets.size;
  const progressPercent = (loadedCount / totalAssets) * 100;
  const isComplete = loadedCount === totalAssets;

  useEffect(() => {
    const loadAsset = async (asset: (typeof ASSETS_TO_LOAD)[0]) => {
      const assetId = `${asset.type}-${asset.name}`;
      try {
        if (asset.type === 'image') {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = asset.src;
          });
        } else {
          const response = await fetch(asset.src, { method: 'HEAD' });
          if (!response.ok) console.warn(`Audio missing: ${asset.src}`);
        }
        setLoadedAssets((prev) => new Set([...prev, assetId]));
      } catch {
        setLoadedAssets((prev) => new Set([...prev, assetId]));
      }
    };
    void Promise.all(ASSETS_TO_LOAD.map(loadAsset));
  }, []);

  const handleStartExperience = async () => {
    if (!isComplete || hasStarted) return;
    setHasStarted(true);
    try {
      await onStartExperience();
      await Promise.resolve(onLoadComplete());
    } catch (error) {
      console.error('Failed to start experience:', error);
      setHasStarted(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-label="System initialization"
    >
      <div className="flex flex-col items-center gap-10 px-4 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white/90 font-inter-tight mb-2 opacity-50 blur-[1px]">
            Vocaloid
          </h1>
          <p className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-zinc-500">
            System Initialization
          </p>
        </motion.div>

        <div className="w-full" aria-live="polite" aria-atomic="true">
          <ECGMonitor theme="miku" color="#39C5BB" width="100%" height="72px" />
        </div>

        <div className="w-full space-y-6">
          <div className="relative h-12 w-full bg-black border border-[#39C5BB]/20 rounded-md overflow-hidden flex items-center shadow-[0_0_15px_rgba(57,197,187,0.15)]">
            <motion.div
              className="absolute left-0 top-0 h-full overflow-hidden flex items-center bg-[#39C5BB]/20"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="absolute top-0 right-0 w-[4px] h-full bg-[#39C5BB] blur-[2px] opacity-80 shadow-[0_0_10px_#39C5BB]" />
            </motion.div>
          </div>
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em]">
            <span className="text-zinc-600">Assets Loaded</span>
            <span className="text-[#39C5BB]" style={{ textShadow: '0 0 10px #39C5BB' }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={handleStartExperience}
          disabled={!isComplete || hasStarted}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 10 }}
          transition={{ duration: 0.6, delay: isComplete ? 0.2 : 0 }}
          whileHover={isComplete && !hasStarted ? { scale: 1.05 } : {}}
          whileTap={isComplete && !hasStarted ? { scale: 0.98 } : {}}
          className="relative mt-8 px-12 py-4 rounded-none font-bold uppercase tracking-[0.3em] text-sm transition-all duration-500 overflow-hidden group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#39C5BB]"
          style={{
            color: isComplete ? '#fff' : '#3f3f46',
            border: isComplete ? '1px solid rgba(57,197,187,0.5)' : '1px solid rgba(63,63,70,0.5)',
            cursor: isComplete && !hasStarted ? 'pointer' : 'not-allowed',
          }}
        >
          {isComplete && (
            <div className="absolute inset-0 bg-[#39C5BB]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
          <span className="relative z-10">{hasStarted ? 'Unlocking...' : 'Start Experience'}</span>
        </motion.button>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 text-center max-w-sm">
          Audio starts after you tap — use the mute control in the corner anytime
        </p>
      </div>
    </motion.div>
  );
}

export const LoadingScreen = memo(LoadingScreenBase);
