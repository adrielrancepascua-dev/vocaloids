import { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';
import { vocaloidData } from '../config/vocaloidData';
import type { Vocaloid } from '../config/vocaloidData';
import { CharacterHero } from './CharacterHero';
import { useVibe } from '../contexts/VibeProvider';
import type { CharacterTheme } from '../constants/theme';
import type { VocaloidTrackName } from '../hooks/useVocaloidAudio';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';

import { CharacterTabs } from './CharacterTabs';

const CHARACTER_TO_TRACK: Record<CharacterTheme, VocaloidTrackName> = {
  miku: 'World is Mine',
  teto: 'Kasane Territory',
  neru: 'Gucha Gucha Uruse',
};

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

function CharacterSection({ data, index, total, isActive, analyserNode, onActivate, onNext, setMuffleEffect }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 }); // Trigger when 20% of the full 200vh section is visible (which is ~40vh)
  const isTabsInView = useInView(tabsRef, { amount: 0.4 });

  const themeKey = data.name.toLowerCase().includes('miku') ? 'miku' :
                   data.name.toLowerCase().includes('teto') ? 'teto' : 'neru';  

  useEffect(() => {
    if (isInView) {
      onActivate(themeKey as CharacterTheme);
    }
  }, [isInView, onActivate, themeKey]);

  useEffect(() => {
    if (isActive) {
      setMuffleEffect(isTabsInView);
    }
  }, [isActive, isTabsInView, setMuffleEffect]);

  return (
    <section ref={sectionRef} id={`character-${index}`} className="relative flex flex-col w-full min-h-[200dvh]">
      {/* Screen 1: Hero Profile */}
      <div
        className="h-[100dvh] w-full shrink-0 snap-start snap-always relative flex items-center justify-center overflow-x-hidden p-0 md:p-8"
      >
        {/* Render Canvas ONLY when this character is conceptually active or in view to save resources */}
        {isInView && (
          <AudioVisualizerCanvas analyserNode={analyserNode} activeCharacterName={data.name} />
        )}
        <CharacterHero
          characterData={data}
          alignment={index % 2 !== 0 ? 'right' : 'left'}
        />
        <div className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 animate-bounce opacity-80 flex flex-col items-center gap-2 pointer-events-none hidden md:flex">
          <span className="text-xs uppercase tracking-[0.3em] font-medium font-inter-tight opacity-70">Scroll Details</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>

      {/* Screen 2: Tabs Data */}
      <div
        ref={tabsRef}
        className="h-[100dvh] w-full shrink-0 snap-start snap-always relative flex flex-col items-center justify-center p-4 md:px-8 bg-black/40 bg-cover bg-center bg-no-repeat bg-fixed py-24"
        style={{ backgroundImage: `url(${data.bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <div className="relative z-10 w-full flex justify-center">
          <CharacterTabs characterData={data} />
        </div>

        {index < total - 1 && (
          <button
            onClick={onNext}
            className="absolute bottom-12 group rounded-full border border-white/20 bg-black/40 px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/50 hover:px-12"
          >
            <span className="relative z-10 flex items-center gap-4">
              Next Character <span className="text-xl group-hover:translate-y-1 transition-transform duration-300">↓</span>
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
}

export function MainStage({ onCharacterTrackChange, analyserNode, setMuffleEffect }: MainStageProps) {
  const { activeCharacter, setActiveCharacter } = useVibe();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleActivate = (theme: CharacterTheme) => {
    setActiveCharacter(theme);
    // Fire and forget audio transition
    void onCharacterTrackChange(CHARACTER_TO_TRACK[theme]);
  };

  const handleNext = (currentIndex: number) => {
    const nextSection = document.getElementById(`character-${currentIndex + 1}`);
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {vocaloidData.map((data, index) => {
        const themeKey = data.name.toLowerCase().includes('miku') ? 'miku' :
                         data.name.toLowerCase().includes('teto') ? 'teto' : 'neru';
        return (
          <CharacterSection
            key={data.name}
            data={data}
            index={index}
            total={vocaloidData.length}
            isActive={activeCharacter === themeKey}
            analyserNode={analyserNode}
            onActivate={handleActivate}
            onNext={() => handleNext(index)}
            setMuffleEffect={setMuffleEffect}
          />
        );
      })}
    </div>
  );
}
