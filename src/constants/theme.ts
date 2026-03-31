export const THEMES = {
  miku: {
    primaryColor: '#39C5BB',
    secondaryGradient: 'linear-gradient(45deg, #39C5BB, #008888)',
    customBoxShadow: '0 4px 20px rgba(57, 197, 187, 0.4)'
  },
  teto: {
    primaryColor: '#C33149',
    secondaryGradient: 'linear-gradient(45deg, #C33149, #5A1827)',
    customBoxShadow: '0 4px 20px rgba(195, 49, 73, 0.4)'
  },
  neru: {
    primaryColor: '#FFD700',
    secondaryGradient: 'linear-gradient(45deg, #FFD700, #8B8000)',
    customBoxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)'
  }
} as const;

export type CharacterTheme = keyof typeof THEMES;
