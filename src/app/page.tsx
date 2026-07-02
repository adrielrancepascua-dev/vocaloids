"use client";
import { useCallback, useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { VibeProvider } from '../contexts/VibeProvider';
import { LoadingScreen } from '../components/LoadingScreen';
import { MainStage } from '../components/MainStage';
import { CustomCursor } from '../components/CustomCursor';
import { useVocaloidAudio } from '../hooks/useVocaloidAudio';
import { TerminalChat } from '../components/TerminalChat';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getEffectsForTheme } from '../config/characterEffects';
import '@fontsource/inter-tight/800.css';
import '@fontsource/inter-tight/900.css';

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [pendingTrack, setPendingTrack] = useState<ReturnType<typeof useVocaloidAudio>['activeTrack']>(null);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const { switchTrack, startExperience, analyserNode, setMuffleEffect, setEasterEggMode, setMasterVolume } =
    useVocaloidAudio();
  const konamiRef = useRef<string>('');
  const mainStageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      konamiRef.current += e.key.toUpperCase();
      if (konamiRef.current.length > 4) konamiRef.current = konamiRef.current.slice(-4);
      if (konamiRef.current === 'TETO') {
        setEasterEggActive((prev) => {
          const next = !prev;
          setEasterEggMode(next);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setEasterEggMode]);

  useEffect(() => {
    if (reducedMotion || !analyserNode) return;
    let rafId: number;
    const loop = () => {
      if (analyserNode && mainStageRef.current) {
        const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(dataArray);
        const bass = (dataArray[2] + dataArray[3] + dataArray[4]) / 3;
        if (bass > 240) {
          const x = (Math.random() - 0.5) * (bass - 230) * 0.4;
          const y = (Math.random() - 0.5) * (bass - 230) * 0.4;
          mainStageRef.current.style.transform = `translate(${x}px, ${y}px)`;
        } else {
          mainStageRef.current.style.transform = 'translate(0px, 0px)';
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(rafId);
  }, [analyserNode, reducedMotion]);

  const handleLoadingComplete = useCallback(async () => {
    await switchTrack(getEffectsForTheme('miku').defaultTrack);
    setUnlocked(true);
  }, [switchTrack]);

  const handleCharacterTrackChange = useCallback(
    async (track: ReturnType<typeof useVocaloidAudio>['activeTrack']) => {
      if (unlocked && track) await switchTrack(track);
      else if (!unlocked && track) setPendingTrack(track);
    },
    [switchTrack, unlocked],
  );

  useEffect(() => {
    if (unlocked && pendingTrack) {
      switchTrack(pendingTrack);
      setPendingTrack(null);
    }
  }, [unlocked, pendingTrack, switchTrack]);

  const toggleMute = () => {
    const next = !audioMuted;
    setAudioMuted(next);
    setMasterVolume(next ? 0 : 0.15);
  };

  return (
    <VibeProvider>
      <CustomCursor />

      <div
        ref={mainStageRef}
        className={`text-white transition-all duration-500 bg-zinc-950 min-h-screen ${easterEggActive ? 'invert hue-rotate-180 contrast-150 saturate-200' : ''}`}
        style={{ background: 'var(--secondary-gradient)' }}
      >
        <MainStage
          onCharacterTrackChange={handleCharacterTrackChange}
          analyserNode={analyserNode}
          setMuffleEffect={setMuffleEffect}
          scrollEnabled={unlocked}
        />
      </div>

      {unlocked && (
        <button
          type="button"
          onClick={toggleMute}
          className="fixed bottom-6 left-6 z-[200] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20 bg-black/60 backdrop-blur-md text-white/80 hover:text-white hover:border-white/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
          aria-pressed={audioMuted}
          aria-label={audioMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {audioMuted ? 'Audio Off' : 'Audio On'}
        </button>
      )}

      <TerminalChat />

      <AnimatePresence mode="wait">
        {!unlocked && (
          <LoadingScreen key="loading" onLoadComplete={handleLoadingComplete} onStartExperience={startExperience} />
        )}
      </AnimatePresence>
    </VibeProvider>
  );
}

export default function Page() {
  return <App />;
}
