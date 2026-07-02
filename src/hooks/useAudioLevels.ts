"use client";
import { useEffect, useRef } from 'react';

export type AudioLevels = {
  bass: number;
  mid: number;
  treble: number;
  bassKick: boolean;
  trebleClip: boolean;
};

const DEFAULT_LEVELS: AudioLevels = {
  bass: 0,
  mid: 0,
  treble: 0,
  bassKick: false,
  trebleClip: false,
};

export function useAudioLevels(analyserNode: AnalyserNode | null) {
  const levelsRef = useRef<AudioLevels>({ ...DEFAULT_LEVELS });

  useEffect(() => {
    if (!analyserNode) {
      levelsRef.current = { ...DEFAULT_LEVELS };
      return;
    }

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let rafId = 0;

    const tick = () => {
      analyserNode.getByteFrequencyData(dataArray);

      let bassSum = 0;
      for (let i = 0; i < 10; i++) bassSum += dataArray[i] || 0;
      const bass = bassSum / 10;

      const midStart = Math.floor(bufferLength * 0.2);
      const midEnd = Math.floor(bufferLength * 0.6);
      let midSum = 0;
      for (let i = midStart; i < midEnd; i++) midSum += dataArray[i] || 0;
      const mid = midSum / (midEnd - midStart);

      const trebleStart = Math.floor(bufferLength * 0.7);
      let trebleSum = 0;
      for (let i = trebleStart; i < bufferLength; i++) trebleSum += dataArray[i] || 0;
      const treble = trebleSum / (bufferLength - trebleStart);

      levelsRef.current = {
        bass,
        mid,
        treble,
        bassKick: bass > 210,
        trebleClip: treble > 100,
      };

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [analyserNode]);

  return levelsRef;
}
