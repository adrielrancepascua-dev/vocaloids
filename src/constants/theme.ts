export const THEMES = {
  miku: {
    primaryColor: '#33CCBB',
    secondaryGradient: 'linear-gradient(45deg, #33CCBB, #008888)',
    customBoxShadow: '0 4px 20px rgba(51, 204, 187, 0.4)',
  },
  teto: {
    primaryColor: '#FF4444',
    secondaryGradient: 'linear-gradient(45deg, #FF4444, #5A1827)',
    customBoxShadow: '0 4px 20px rgba(255, 68, 68, 0.4)',
  },
  neru: {
    primaryColor: '#FFD700',
    secondaryGradient: 'linear-gradient(45deg, #FFD700, #8B8000)',
    customBoxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
  },
} as const;

export type CharacterTheme = keyof typeof THEMES;
