---
name: project-identity-rules
description: Preserves character-specific visual/audio treatments, config-driven refactors, and hand-tuned animation values for the cinematic Vocaloid showcase. Use when refactoring, adding features, touching vocaloidData.ts or theme.ts, or modifying named effects (CustomCursor, ECGMonitor, AudioVisualizerCanvas).
---

# Project Identity Rules — DO NOT GENERICIZE

This is a cinematic, audio-reactive Vocaloid showcase. Its value IS its
specificity. When refactoring or adding features:

1. NEVER remove or "simplify away" a character-specific visual/audio treatment
   (Miku's neon cutout, Teto's glitch/caution-tape, Neru's low-battery/static)
   without explicit approval — these are signature, not decoration.
2. When you see hardcoded per-character conditionals (isTeto, isNeru, etc.),
   the fix is to generalize into a per-character CONFIG OBJECT
   (see vocaloidData.ts / theme.ts), not to delete the behavior.
3. Preserve exact animation timing/physics values (spring stiffness: 800,
   crossfade: 1.2s, glitch interval: 20s) unless asked to change them —
   these were hand-tuned.
4. Always respect prefers-reduced-motion and provide an audio-optional path.
5. Flag dead/template code (leftover Vite boilerplate, unused mock data)
   for removal, but ask before touching anything under src/components that
   implements a named effect (CustomCursor, ECGMonitor, AudioVisualizerCanvas).
