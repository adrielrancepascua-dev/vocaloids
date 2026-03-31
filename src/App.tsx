import { useCallback, useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { VibeProvider } from './contexts/VibeProvider';
import { LoadingScreen } from './components/LoadingScreen';
import { MainStage } from './components/MainStage';
import { CustomCursor } from './components/CustomCursor';
import { useVocaloidAudio } from './hooks/useVocaloidAudio';
import { TerminalChat } from './components/TerminalChat';
import '@fontsource/inter-tight/800.css';
import '@fontsource/inter-tight/900.css';

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const { switchTrack, startExperience, analyserNode, setMuffleEffect, setEasterEggMode } = useVocaloidAudio();
  const konamiRef = useRef<string>("");
  const mainStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      konamiRef.current += e.key.toUpperCase();
      if (konamiRef.current.length > 4) {
        konamiRef.current = konamiRef.current.slice(-4);
      }
      if (konamiRef.current === "TETO") {
        setEasterEggActive(prev => {
          const next = !prev;
          setEasterEggMode(next);
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setEasterEggMode]);

  // Haptic Feedback / Screen Shake Loop
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      if (analyserNode && mainStageRef.current) {
        const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(dataArray);
        // Measure low frequency (bass) transient energy roughly
        const bass = (dataArray[2] + dataArray[3] + dataArray[4]) / 3;
        
        if (bass > 240) {
          const x = (Math.random() - 0.5) * (bass - 230) * 0.4;
          const y = (Math.random() - 0.5) * (bass - 230) * 0.4;
          mainStageRef.current.style.transform = `translate(${x}px, ${y}px)`;
        } else {
          mainStageRef.current.style.transform = `translate(0px, 0px)`;
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(rafId);
  }, [analyserNode]);

  const handleLoadingComplete = useCallback(async () => {
    // Wait for the track to switch and then unlock so MainStage doesn't conflict immediately
    await switchTrack('World is Mine');
    setUnlocked(true);
  }, [switchTrack]);

  const handleCharacterTrackChange = useCallback(
    async (track: ReturnType<typeof useVocaloidAudio>["activeTrack"]) => {      
      if (unlocked && track) {
        await switchTrack(track);
      }
    },
    [switchTrack, unlocked],
  );

  return (
    <VibeProvider>
      <CustomCursor />

      {/* We render MainStage unconditionally so it sits under the loading screen,
          but we only wire its audio events after unlock to avoid errors */}    
      <div
        ref={mainStageRef}
        className={`text-white transition-all duration-500 bg-zinc-950 min-h-screen ${easterEggActive ? 'invert hue-rotate-180 contrast-150 saturate-200' : ''}`}
        style={{ background: 'var(--secondary-gradient)' }}
      >
        <MainStage onCharacterTrackChange={handleCharacterTrackChange} analyserNode={analyserNode} setMuffleEffect={setMuffleEffect} />
      </div>

      <TerminalChat />

      <AnimatePresence mode="wait">
        {!unlocked && (
          <LoadingScreen key="loading" onLoadComplete={handleLoadingComplete} onStartExperience={startExperience} />
        )}
      </AnimatePresence>
    </VibeProvider>
  );
}

export default App;
