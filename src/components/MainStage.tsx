"use client";
import { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';
import { vocaloidData } from '../config/vocaloidData';
import type { Vocaloid } from '../config/vocaloidData';
import { getEffectsForTheme } from '../config/characterEffects';
import { CharacterHero } from './CharacterHero';
import { useVibe } from '../contexts/VibeProvider';
import type { CharacterTheme } from '../constants/theme';
import type { VocaloidTrackName } from '../hooks/useVocaloidAudio';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';
import { CharacterTabs } from './CharacterTabs';
import { CharacterScene3DLazy } from './r3f/CharacterScene3DLazy';
import { useAudioLevels } from '../hooks/useAudioLevels';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { useMainStageGsap } from '../hooks/useMainStageGsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface SectionProps {
  data: Vocaloid;
  index: number;
  total: number;
  isActive: boolean;
  analyserNode: AnalyserNode | null;
  onActivate: (theme: CharacterTheme) => void;
  onNext: () => void;
  setMuffleEffect: (isMuffled: boolean) => void;
}

function CharacterSection({
  data,
  index,
  total,
  isActive,
  analyserNode,
  onActivate,
  onNext,
  setMuffleEffect,
}: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const isTabsInView = useInView(tabsRef, { amount: 0.4 });
  const { isLowEnd } = usePerformanceMonitor();
  const levelsRef = useAudioLevels(isInView ? analyserNode : null);
  const reducedMotion = useReducedMotion();

  const themeKey = data.theme;

  useEffect(() => {
    if (isInView) onActivate(themeKey);
  }, [isInView, onActivate, themeKey]);

  useEffect(() => {
    if (isActive) setMuffleEffect(isTabsInView);
  }, [isActive, isTabsInView, setMuffleEffect]);

  return (
    <section ref={sectionRef} id={`character-${index}`} className="relative flex flex-col w-full min-h-[200dvh]">
      <div
        data-gsap="hero"
        className="h-[100dvh] w-full shrink-0 snap-start snap-always relative flex items-center justify-center overflow-x-hidden p-0 md:p-8"
      >
        {isInView && (
          <>
            <CharacterScene3DLazy
              theme={themeKey}
              color={data.colors.primary}
              levelsRef={levelsRef}
              isLowEnd={isLowEnd}
            />
            <AudioVisualizerCanvas
              analyserNode={analyserNode}
              theme={themeKey}
              color={data.colors.primary}
              isLowEnd={isLowEnd}
            />
          </>
        )}
        <CharacterHero characterData={data} alignment={index % 2 !== 0 ? 'right' : 'left'} />
        <div
          className={`absolute bottom-[8vh] left-1/2 -translate-x-1/2 opacity-80 flex flex-col items-center gap-2 pointer-events-none hidden md:flex ${reducedMotion ? '' : 'animate-bounce'}`}
        >
          <span className="text-xs uppercase tracking-[0.3em] font-medium font-inter-tight opacity-70">Scroll Details</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>

      <div
        ref={tabsRef}
        data-gsap="tabs"
        className="h-[100dvh] w-full shrink-0 snap-start snap-always relative flex flex-col items-center justify-center p-4 md:px-8 bg-black/40 bg-cover bg-center bg-no-repeat pb-32 md:pb-24 pt-16 md:pt-24"
        style={{ backgroundImage: `url(${data.bgImage})`, backgroundAttachment: reducedMotion ? 'scroll' : 'fixed' }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <div className="relative z-10 w-full flex justify-center">
          <CharacterTabs characterData={data} />
        </div>

        {index < total - 1 && (
          <button
            type="button"
            onClick={onNext}
            className="absolute bottom-6 md:bottom-12 group rounded-full border border-white/20 bg-black/40 px-6 py-3 md:px-10 md:py-5 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/50 hover:px-12 hidden md:block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            <span className="relative z-10 flex items-center gap-2 md:gap-4">
              Next Character <span className="text-base md:text-xl group-hover:translate-y-1 transition-transform duration-300">↓</span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

interface MainStageProps {
  onCharacterTrackChange: (track: VocaloidTrackName) => Promise<void>;
  analyserNode: AnalyserNode | null;
  setMuffleEffect: (isMuffled: boolean) => void;
  scrollEnabled?: boolean;
}

export function MainStage({
  onCharacterTrackChange,
  analyserNode,
  setMuffleEffect,
  scrollEnabled = true,
}: MainStageProps) {
  const { activeCharacter, setActiveCharacter } = useVibe();
  const containerRef = useRef<HTMLDivElement>(null);

  useMainStageGsap(containerRef, vocaloidData.length, scrollEnabled);

  const handleActivate = (theme: CharacterTheme) => {
    setActiveCharacter(theme);
    void onCharacterTrackChange(getEffectsForTheme(theme).defaultTrack);
  };

  const handleNext = (currentIndex: number) => {
    const nextSection = document.getElementById(`character-${currentIndex + 1}`);
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`::-webkit-scrollbar { display: none; }`}</style>
      <div className="pointer-events-none fixed inset-0 z-[5] opacity-[0.035] mix-blend-overlay" aria-hidden style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
      {vocaloidData.map((data, index) => (
        <CharacterSection
          key={data.name}
          data={data}
          index={index}
          total={vocaloidData.length}
          isActive={activeCharacter === data.theme}
          analyserNode={analyserNode}
          onActivate={handleActivate}
          onNext={() => handleNext(index)}
          setMuffleEffect={setMuffleEffect}
        />
      ))}
    </div>
  );
}
