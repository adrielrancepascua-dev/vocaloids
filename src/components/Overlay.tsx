import { useState } from 'react';
import { motion } from 'motion/react';

interface OverlayProps {
  onUnlocked: () => Promise<void> | void;
}

export function Overlay({ onUnlocked }: OverlayProps) {
  const [isStarting, setIsStarting] = useState(false);

  const initAudio = async () => {
    try {
      setIsStarting(true);
      await onUnlocked();
    } catch (e) {
      console.error('Audio initialization failed', e);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={initAudio}
        disabled={isStarting}
        className="px-8 py-4 text-2xl font-bold tracking-widest text-white uppercase transition-all duration-300 border-2 rounded-full border-white/20 hover:border-white/60 hover:bg-white/10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isStarting ? 'Initializing Audio...' : 'Enter the Experience'}
      </motion.button>
    </motion.div>
  );
}