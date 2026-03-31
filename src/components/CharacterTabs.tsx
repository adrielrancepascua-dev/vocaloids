"use client";
import { useMemo, useState, memo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Vocaloid } from '../config/vocaloidData';

import { ECGMonitor } from './ECGMonitor';

type TabKey = 'autobiography' | 'influences' | 'song-stats' | 'core-stats';

type TabConfig = {
  key: TabKey;
  label: string;
};

const TABS: TabConfig[] = [
  { key: 'autobiography', label: 'About' },
  { key: 'core-stats', label: 'Stats' },
  { key: 'influences', label: 'Influence' },
  { key: 'song-stats', label: 'Top Songs' },
];

type CharacterTabsProps = {
  characterData: Vocaloid;
};

function formatPlayCount(count: number): string {
  return new Intl.NumberFormat('en-US').format(count);
}

function CharacterTabsBase({ characterData }: CharacterTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('autobiography');

  const maxPlayCount = useMemo(() => {
    const values = characterData.songs.map((song) => song.playCount);
    return Math.max(...values, 1);
  }, [characterData.songs]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="relative flex flex-wrap items-center justify-center gap-x-4 md:gap-x-12 gap-y-4 md:gap-y-6 border-b border-white/15 pb-4 w-full px-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className="relative pb-2 text-[11px] sm:text-lg md:text-2xl font-bold uppercase tracking-[0.16em] transition-colors duration-200"
              style={{
                color: isActive ? 'var(--primary-color)' : '#d4d4d8',
              }}
            >
              {tab.label}
              {isActive && (
                <motion.span
                  layoutId="character-tabs-underline"
                  className="absolute -bottom-[17px] left-0 h-[3px] w-full rounded-full"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    boxShadow: 'var(--custom-box-shadow)',
                  }}
                  transition={{ type: 'spring', stiffness: 560, damping: 45 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="pt-6 md:pt-12 w-full flex justify-center text-center max-h-[60dvh] md:max-h-[60dvh] overflow-y-auto no-scrollbar pb-12 md:pb-4"
        >
          {activeTab === 'autobiography' && (
            <div className="flex flex-col items-center gap-4 md:gap-6 px-4">
              <p className="text-sm md:text-2xl tracking-[0.2em] font-medium uppercase font-inter-tight" style={{ color: characterData.colors.primary }}>       
                {characterData.loreMetric}
              </p>
              <p className="text-base md:text-3xl leading-relaxed text-zinc-200 max-w-3xl font-light">{characterData.bio}</p>
            </div>
          )}

          {activeTab === 'core-stats' && (
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-8 w-full max-w-3xl">
              <div className="flex flex-col items-center p-3 md:p-6 border border-white/10 rounded-xl md:rounded-2xl bg-black/20 backdrop-blur-sm">
                <span className="text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 mb-1 md:mb-2">Age</span>
                <span className="text-xl md:text-4xl font-bold font-inter-tight" style={{ color: characterData.colors.primary }}>
                  {characterData.stats.age}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 md:p-6 border border-white/10 rounded-xl md:rounded-2xl bg-black/20 backdrop-blur-sm">
                <span className="text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 mb-1 md:mb-2">Height</span>
                <span className="text-xl md:text-4xl font-bold font-inter-tight" style={{ color: characterData.colors.primary }}>
                  {characterData.stats.height}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 md:p-6 border border-white/10 rounded-xl md:rounded-2xl bg-black/20 backdrop-blur-sm">
                <span className="text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 mb-1 md:mb-2">Weight</span>
                <span className="text-xl md:text-4xl font-bold font-inter-tight" style={{ color: characterData.colors.primary }}>
                  {characterData.stats.weight}
                </span>
              </div>
              <div className="col-span-3 md:col-span-3 flex flex-col items-center p-4 md:p-6 border border-white/10 rounded-xl md:rounded-2xl bg-black/20 backdrop-blur-sm mt-0 md:mt-4">
                <span className="text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 mb-1 md:mb-2">System Status</span>
                <span className="text-lg md:text-2xl font-bold font-inter-tight tracking-wider" style={{ color: characterData.colors.primary }}>
                  [{characterData.modelStatus}]
                </span>
              </div>
            </div>
          )}

          {activeTab === 'influences' && (
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {characterData.influences.map((influence) => (
                <span
                  key={influence}
                  className="rounded-full border-2 px-6 py-3 md:px-8 md:py-4 text-sm md:text-xl font-bold uppercase tracking-[0.18em]"
                  style={{
                    borderColor: 'var(--primary-color)',
                    color: 'var(--primary-color)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    boxShadow: 'var(--custom-box-shadow)',
                  }}
                >
                  {influence}
                </span>
              ))}
            </div>
          )}

          {activeTab === 'song-stats' && (
            <ul data-song-list="true" className="space-y-4 md:space-y-8 w-full max-w-2xl text-left px-4">
              {characterData.songs.map((song, index) => {
                const rawPercent = (song.playCount / maxPlayCount) * 100;
                const popularityPercent = Math.max(12, Math.min(100, rawPercent));

                return (
                  <li key={`${song.title}-${song.year}`} className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-4 border-b border-white/10 pb-2">
                      <p className="text-lg md:text-2xl font-bold text-zinc-100 uppercase tracking-wider">
                        {song.title}
                        <span className="ml-2 md:ml-3 text-sm md:text-lg text-zinc-500 font-normal">({song.year})</span>
                      </p>
                      <p className="text-base md:text-xl font-medium text-zinc-300">
                        {formatPlayCount(song.playCount)} <span className="text-xs md:text-sm text-zinc-500 uppercase">plays</span>
                      </p>
                    </div>

                    <div className="h-6 w-full relative overflow-hidden rounded-full bg-black/40 border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${popularityPercent}%` }}
                        transition={{ duration: 1.2, delay: index * 0.1, ease: 'easeOut' }}
                        className="h-full absolute left-0 top-0 overflow-hidden"
                      >
                        <ECGMonitor 
                          theme={characterData.theme} 
                          color={characterData.colors.primary} 
                          width="1000px" 
                          height="24px" 
                        />
                      </motion.div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export const CharacterTabs = memo(CharacterTabsBase, (prev, next) => {
  return prev.characterData.name === next.characterData.name;
});

