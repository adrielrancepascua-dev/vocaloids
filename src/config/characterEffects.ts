import type { CharacterTheme } from '../constants/theme';
import type { VocaloidTrackName } from '../hooks/useVocaloidAudio';

export type VisualizerMode = 'bezier' | 'particles' | 'spectrum';
export type R3fSceneMode = 'wave-field' | 'burst-field' | 'bar-field';
export type HeroTreatment = 'neon-cutout' | 'industrial-glitch' | 'low-battery';

export type CharacterEffectConfig = {
  defaultTrack: VocaloidTrackName;
  heroImageScale: number;
  heroTreatment: HeroTreatment;
  visualizerMode: VisualizerMode;
  r3fScene: R3fSceneMode;
  particleCount: { high: number; low: number };
  glitchIntervalMs: number;
  glitchDurationMs: number;
  ecgDuration: number;
  designationWatermark: string;
};

export const CHARACTER_EFFECTS: Record<CharacterTheme, CharacterEffectConfig> = {
  miku: {
    defaultTrack: 'World is Mine',
    heroImageScale: 0.85,
    heroTreatment: 'neon-cutout',
    visualizerMode: 'bezier',
    r3fScene: 'wave-field',
    particleCount: { high: 2400, low: 800 },
    glitchIntervalMs: 20000,
    glitchDurationMs: 150,
    ecgDuration: 1.2,
    designationWatermark: 'CV01',
  },
  teto: {
    defaultTrack: 'Kasane Territory',
    heroImageScale: 0.9,
    heroTreatment: 'industrial-glitch',
    visualizerMode: 'particles',
    r3fScene: 'burst-field',
    particleCount: { high: 150, low: 40 },
    glitchIntervalMs: 20000,
    glitchDurationMs: 150,
    ecgDuration: 0.6,
    designationWatermark: '0401',
  },
  neru: {
    defaultTrack: 'Stop Nagging Me',
    heroImageScale: 0.85,
    heroTreatment: 'low-battery',
    visualizerMode: 'spectrum',
    r3fScene: 'bar-field',
    particleCount: { high: 64, low: 32 },
    glitchIntervalMs: 20000,
    glitchDurationMs: 150,
    ecgDuration: 2.0,
    designationWatermark: 'DEN2',
  },
};

export function getEffectsForTheme(theme: CharacterTheme): CharacterEffectConfig {
  return CHARACTER_EFFECTS[theme];
}
