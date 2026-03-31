import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { THEMES } from '../constants/theme';
import type { CharacterTheme } from '../constants/theme';

interface VibeContextType {
  activeCharacter: CharacterTheme;
  setActiveCharacter: (character: CharacterTheme) => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export function VibeProvider({ children }: { children: ReactNode }) {
  const [activeCharacter, setActiveCharacter] = useState<CharacterTheme>('miku');

  useEffect(() => {
    const theme = THEMES[activeCharacter];
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-gradient', theme.secondaryGradient);
    document.documentElement.style.setProperty('--custom-box-shadow', theme.customBoxShadow);
  }, [activeCharacter]);

  return (
    <VibeContext.Provider value={{ activeCharacter, setActiveCharacter }}>
      {children}
    </VibeContext.Provider>
  );
}

export function useVibe() {
  const context = useContext(VibeContext);
  if (!context) {
    throw new Error('useVibe must be used within a VibeProvider');
  }
  return context;
}