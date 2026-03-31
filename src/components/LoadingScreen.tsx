import { useEffect, useState, memo } from 'react';
import { motion } from 'motion/react';
import { ECGMonitor } from './ECGMonitor';

interface LoadingScreenProps {
  onLoadComplete: () => Promise<void> | void;
  onStartExperience: () => Promise<void>;
}

const ASSETS_TO_LOAD = [
  // Placeholder assets for testing - these will fail to load but won't block the UI
  { type: 'placeholder', name: 'Miku Asset', src: '#' },
  { type: 'placeholder', name: 'Teto Asset', src: '#' },
  { type: 'placeholder', name: 'Neru Asset', src: '#' },
  { type: 'placeholder', name: 'Audio Track 1', src: '#' },
  { type: 'placeholder', name: 'Audio Track 2', src: '#' },
  { type: 'placeholder', name: 'Audio Track 3', src: '#' },
];

function LoadingScreenBase({ onLoadComplete, onStartExperience }: LoadingScreenProps) {
  const [loadedAssets, setLoadedAssets] = useState<Set<string>>(new Set());
  const [hasStarted, setHasStarted] = useState(false);

  const totalAssets = ASSETS_TO_LOAD.length;
  const loadedCount = loadedAssets.size;
  const progressPercent = (loadedCount / totalAssets) * 100;
  const isComplete = loadedCount === totalAssets;

  // Load assets on mount
  useEffect(() => {
    const loadAsset = async (asset: typeof ASSETS_TO_LOAD[0]) => {
      const assetId = `${asset.type}-${asset.name}`;
      
      try {
        if (asset.type === 'placeholder') {
          // Placeholder assets load immediately
          setLoadedAssets((prev) => new Set([...prev, assetId]));
        } else if (asset.type === 'image') {
          const img = new Image();
          img.src = asset.src;
          
          return new Promise<void>((resolve) => {
            img.onload = () => {
              setLoadedAssets((prev) => new Set([...prev, assetId]));
              resolve();
            };
            img.onerror = () => {
              // Gracefully handle missing images
              setLoadedAssets((prev) => new Set([...prev, assetId]));
              resolve();
            };
          });
        } else {
          // Audio loading is delegated to the audio hook
          // For now, mark as loaded after a simulated fetch
          const response = await fetch(asset.src);
          if (response.ok) {
            setLoadedAssets((prev) => new Set([...prev, assetId]));
          } else {
            // Gracefully handle missing audio files
            setLoadedAssets((prev) => new Set([...prev, assetId]));
          }
        }
      } catch (error) {
        console.warn(`Failed to load ${asset.type}: ${asset.name}`);
        // Mark as loaded anyway to not block the UI indefinitely
        setLoadedAssets((prev) => new Set([...prev, assetId]));
      }
    };

    // Load all assets in parallel
    Promise.all(ASSETS_TO_LOAD.map(loadAsset));
  }, []);

  const handleStartExperience = async () => {
    if (!isComplete) return;
    
    setHasStarted(true);
    try {
      await onStartExperience();
      // Call onLoadComplete after audio context is ready
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
    >
      <div className="flex flex-col items-center gap-10 px-4 w-full max-w-2xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white/90 font-inter-tight mb-2 opacity-50 blur-[1px]">
            Vocaloid
          </h1>
          <p className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-zinc-500">
            System Initialization
          </p>
        </motion.div>

        {/* Minimal Progress Bar with Glowing Neon Shadow */}
        <div className="w-full space-y-6">
<div className="relative h-12 w-full bg-black border border-[#39C5BB]/20 rounded-md overflow-hidden flex items-center shadow-[0_0_15px_rgba(57,197,187,0.15)]">
            <motion.div
              className="absolute left-0 top-0 h-full overflow-hidden flex items-center"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
               <ECGMonitor 
                 theme="miku" 
                 color="#39C5BB" 
                 width="800px" 
                 height="100%" 
               />
               <div className="absolute top-0 right-0 w-[4px] h-full bg-[#39C5BB] blur-[2px] opacity-80 shadow-[0_0_10px_#39C5BB]" />
            </motion.div>
          </div>
          
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em]">
            <motion.span 
              className="text-zinc-600"
              animate={{ opacity: isComplete ? 1 : 0.5 }}
            >
              Assets Loaded
            </motion.span>
            <motion.span 
              className="text-[#39C5BB]"
              style={{ textShadow: '0 0 10px #39C5BB' }}
            >
              {Math.round(progressPercent)}%
            </motion.span>
          </div>
        </div>

        {/* Start Button */}
        <motion.button
          onClick={handleStartExperience}
          disabled={!isComplete || hasStarted}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 10 }}
          transition={{ duration: 0.6, delay: isComplete ? 0.2 : 0 }}
          whileHover={isComplete && !hasStarted ? { scale: 1.05 } : {}}
          whileTap={isComplete && !hasStarted ? { scale: 0.98 } : {}}
          className="relative mt-8 px-12 py-4 rounded-none font-bold uppercase tracking-[0.3em] text-sm transition-all duration-500 overflow-hidden group"
          style={{
            color: isComplete ? '#fff' : '#3f3f46',
            border: isComplete ? '1px solid rgba(57,197,187,0.5)' : '1px solid rgba(63,63,70,0.5)',
            cursor: isComplete && !hasStarted ? 'pointer' : 'not-allowed',
          }}
        >
          {/* Hover glow background */}
          {isComplete && (
            <div className="absolute inset-0 bg-[#39C5BB]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
          
          <span className="relative z-10">
            {hasStarted ? 'Unlocking...' : 'Start Experience'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export const LoadingScreen = memo(LoadingScreenBase);
