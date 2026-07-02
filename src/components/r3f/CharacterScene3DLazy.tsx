"use client";
import dynamic from 'next/dynamic';
import type { CharacterTheme } from '../../constants/theme';
import type { AudioLevels } from '../../hooks/useAudioLevels';

const CharacterScene3DInner = dynamic(
  () => import('./CharacterScene3D').then((m) => m.CharacterScene3D),
  { ssr: false, loading: () => null },
);

export type CharacterScene3DLazyProps = {
  theme: CharacterTheme;
  color: string;
  levelsRef: React.RefObject<AudioLevels>;
  isLowEnd: boolean;
  className?: string;
};

export function CharacterScene3DLazy(props: CharacterScene3DLazyProps) {
  return <CharacterScene3DInner {...props} />;
}
