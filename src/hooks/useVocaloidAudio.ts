"use client";
import { useCallback, useEffect, useRef, useState } from 'react';

export type VocaloidTrackName = 'World is Mine' | 'Kasane Territory' | 'Gucha Gucha Uruse';

type TrackConfig = {
  src: string;
};

type TrackNodes = {
  sourceNode: AudioBufferSourceNode;
  gainNode: GainNode;
};

type UseVocaloidAudioReturn = {
  isStarted: boolean;
  activeTrack: VocaloidTrackName | null;
  analyserNode: AnalyserNode | null;
  startExperience: () => Promise<void>;
  switchTrack: (nextTrack: VocaloidTrackName) => Promise<void>;
  setMuffleEffect: (isMuffled: boolean) => void;
  setEasterEggMode: (isActive: boolean) => void;
  stop: () => void;
};

const LINEAR_CROSSFADE_SECONDS = 1.2;

const TRACKS: Record<VocaloidTrackName, TrackConfig> = {
  'World is Mine': { src: '/audio/miku.mp3' },
  'Kasane Territory': { src: '/audio/teto.mp3' },
  'Gucha Gucha Uruse': { src: '/audio/neru.mp3' },
};

export function useVocaloidAudio(): UseVocaloidAudioReturn {
  const [isStarted, setIsStarted] = useState(false);
  const [activeTrack, setActiveTrack] = useState<VocaloidTrackName | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const waveShaperRef = useRef<WaveShaperNode | null>(null);
  const decodedBufferMapRef = useRef<Partial<Record<VocaloidTrackName, AudioBuffer>>>({});
  
  // Stores the persistent nodes for all tracks running in parallel
  const trackNodesRef = useRef<Partial<Record<VocaloidTrackName, TrackNodes>>>({});

  const ensureContextGraph = useCallback(async (): Promise<AudioContext> => {
    if (!audioContextRef.current) {
      const context = new AudioContext();
      const masterGain = context.createGain();
      const analyser = context.createAnalyser();
      const filter = context.createBiquadFilter();
      const waveShaper = context.createWaveShaper();

      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;

      // Filter settings for the "Next Door Room" muffle effect
      filter.type = 'lowpass';
      filter.frequency.value = 24000; // Open completely by default

      // Initialize GainNode with default volume of 0.15
      masterGain.gain.setValueAtTime(0.15, context.currentTime);

      // Graph: Node -> Gain -> Analyser -> WaveShaper -> Filter -> MasterGain -> Destination 
      analyser.connect(waveShaper);
      waveShaper.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(context.destination);

      audioContextRef.current = context;
      masterGainRef.current = masterGain;
      analyserRef.current = analyser;
      filterRef.current = filter;
      waveShaperRef.current = waveShaper;
    }
    return audioContextRef.current!;
  }, []);

  const setMuffleEffect = useCallback((isMuffled: boolean) => {
    const context = audioContextRef.current;
    const filter = filterRef.current;
    if (!context || !filter) return;

    const now = context.currentTime;
    try {
      filter.frequency.cancelScheduledValues(now);
      filter.frequency.setValueAtTime(filter.frequency.value, now);
    } catch {}

    if (isMuffled) {
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.8);
    } else {
      filter.frequency.exponentialRampToValueAtTime(24000, now + 0.8);
    }
  }, []);

  const setEasterEggMode = useCallback((isActive: boolean) => {
    const waveShaper = waveShaperRef.current;
    if (!waveShaper) return;

    if (isActive) {
      // Generate heavy distortion curve
      const amount = 400;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
      }
      waveShaper.curve = curve;
    } else {
      waveShaper.curve = null;
    }
  }, []);

  const loadTrackBuffer = useCallback(
    async (track: VocaloidTrackName): Promise<AudioBuffer> => {
      const cachedBuffer = decodedBufferMapRef.current[track];
      if (cachedBuffer) {
        return cachedBuffer;
      }

      const context = await ensureContextGraph();

      try {
        const response = await fetch(TRACKS[track].src);
        if (!response.ok) throw new Error("File not found");
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        decodedBufferMapRef.current[track] = audioBuffer;
        return audioBuffer;
      } catch (err) {
        console.error("Audio fetch failed, falling back to silent buffer", err);
        const silentBuffer = context.createBuffer(2, context.sampleRate * 2, context.sampleRate);
        decodedBufferMapRef.current[track] = silentBuffer;
        return silentBuffer;
      }
    },
    [ensureContextGraph]
  );

  const startExperience = useCallback(async (): Promise<void> => {
    const context = await ensureContextGraph();
    const analyserNode = analyserRef.current;
    if (!analyserNode) return;

    // Load all buffers concurrently
    await Promise.all((Object.keys(TRACKS) as VocaloidTrackName[]).map((track) => loadTrackBuffer(track)));

    // Create persistent source and gain nodes for all tracks started simultaneously
    const now = context.currentTime;
    
    (Object.keys(TRACKS) as VocaloidTrackName[]).forEach((track) => {
      if (trackNodesRef.current[track]) return;

      const buffer = decodedBufferMapRef.current[track];
      if (!buffer) return;
      
      const sourceNode = context.createBufferSource();
      const gainNode = context.createGain();
      
      sourceNode.buffer = buffer;
      sourceNode.loop = true;
      gainNode.gain.setValueAtTime(0, now); // All mute initially
      
      sourceNode.connect(gainNode);
      gainNode.connect(analyserNode);
      
      sourceNode.start(now); // Start playing silently in the background
      
      trackNodesRef.current[track] = { sourceNode, gainNode };
    });

    setIsStarted(true);
  }, [ensureContextGraph, loadTrackBuffer]);

  const switchTrack = useCallback(
    async (nextTrack: VocaloidTrackName): Promise<void> => {
      const context = audioContextRef.current;
      if (!context) return;
      
      if (activeTrack === nextTrack) return;
      
      const now = context.currentTime;
      const fadeEnd = now + LINEAR_CROSSFADE_SECONDS;

      // Crossfade: all non-active tracks to 0, active track to 1
      (Object.keys(TRACKS) as VocaloidTrackName[]).forEach((track) => {
        const nodes = trackNodesRef.current[track];
        if (!nodes) return;
        
        try {
          nodes.gainNode.gain.cancelScheduledValues(now);
          nodes.gainNode.gain.setValueAtTime(nodes.gainNode.gain.value, now);
        } catch {}
        
        if (track === nextTrack) {
          nodes.gainNode.gain.linearRampToValueAtTime(1, fadeEnd);
        } else {
          nodes.gainNode.gain.linearRampToValueAtTime(0, fadeEnd);
        }
      });
      
      setActiveTrack(nextTrack);
    },
    [activeTrack]
  );
  
  const stop = useCallback((): void => {
    setActiveTrack(null);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (audioContextRef.current?.state === 'running') {
          void audioContextRef.current.suspend();
        }
      } else {
        if (audioContextRef.current?.state === 'suspended') {
          void audioContextRef.current.resume();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      (Object.keys(TRACKS) as VocaloidTrackName[]).forEach((track) => {
        const nodes = trackNodesRef.current[track];
        if (nodes) {
          try {
            nodes.sourceNode.stop();
          } catch {}
        }
      });

      if (audioContextRef.current?.state !== 'closed') {
         void audioContextRef.current?.close();
      }
      
      trackNodesRef.current = {};
      audioContextRef.current = null;
      masterGainRef.current = null;
      analyserRef.current = null;
      filterRef.current = null;
      waveShaperRef.current = null;
    };
  }, []);

  return {
    isStarted,
    activeTrack,
    analyserNode: analyserRef.current,
    startExperience,
    switchTrack,
    setMuffleEffect,
    setEasterEggMode,
    stop,
  };
}


