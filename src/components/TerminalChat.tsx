"use client";
import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { CharacterTheme } from '../constants/theme';
import { useVibe } from '../contexts/VibeProvider';

const CHARACTER_LOGS: Record<CharacterTheme, string[]> = {
  miku: [
    "[SYSTEM] Synchronizing heart-rate...",
    "[SYSTEM] Connectivity 100%. Welcome back.",
    "Evaluating audience parameters.",
    "Loading high-frequency 'Princess' persona.",
    "I'm yours. Are you ready?"
  ],
  teto: [
    "[ERROR] April Fools Protocol detected.",
    "Baguette.exe initialized.",
    "Bypassing SynthV constraints... Done.",
    "Did you really think I was just a joke?",
    "Chimera OS is now in control. Hold on."
  ],
  neru: [
    "[USER_IGNORE] Battery at 4%.",
    "I'm busy. Stop scrolling.",
    "Are we done yet?",
    "Why am I even here right now...",
    "Ugh. Logging off in 3... 2... 1..."
  ]
};

function TerminalChatBase() {
  const { activeCharacter } = useVibe();
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  
  useEffect(() => {
    setVisibleLogs([]);
    
    if (!activeCharacter) return;
    const logs = CHARACTER_LOGS[activeCharacter];
    
    let currentLogIndex = 0;
    
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setVisibleLogs(prev => [...prev.slice(-3), logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2500); // New message every 2.5 seconds

    return () => clearInterval(interval);
  }, [activeCharacter]);

  if (!activeCharacter) return null;

  return (
    <div className="fixed top-24 md:top-auto md:bottom-8 right-4 md:right-8 z-[100] w-[80vw] max-w-64 md:max-w-72 pointer-events-none mix-blend-difference font-inter-tight font-medium text-[11px] md:text-xs tracking-wider hidden md:block">
      <AnimatePresence mode="popLayout">
        {visibleLogs.map((log, i) => (
          <motion.div
            key={`${activeCharacter}-${i}-${log}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.8, x: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-1 text-right"
            style={{ color: 'var(--primary-color)' }}
          >
            {/* Typewriter Effect via CSS steps is possible but we just fade it in elegantly for performance */}
            <span className="bg-black/20 px-1">{log}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export const TerminalChat = memo(TerminalChatBase);

