# Vocaloid Interactive Portfolio

A cinematic, audio-reactive showcase profiling **Hatsune Miku**, **Kasane Teto**, and **Akita Neru** — built as a portfolio piece that treats each character like a playable faction with its own visual language, sound design, and scroll narrative.

**Live:** [github.com/adrielrancepascua-dev/vocaloids](https://github.com/adrielrancepascua-dev/vocaloids)

---

## What it is

This is not a generic character wiki. It is a **single-page concert intro** that:

- Gates audio behind a deliberate “Start Experience” ritual (ECG loading screen, real asset preload)
- Crossfades character themes as you scroll (1.2s linear gain ramps — hand-tuned)
- Reacts to music in **2D canvas**, **WebGL (React Three Fiber)**, and **CSS** simultaneously
- Applies character-specific hero treatments: Miku neon cutout, Teto industrial glitch + caution tape, Neru low-battery static
- Muffles audio when you scroll into lore tabs (Biquad lowpass “next room” filter)

Secondary routes (`/character/*`, `/song/*`) provide SEO-rich deep pages; the main stage is the portfolio centerpiece.

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16** (App Router) | SSR for song/character SEO pages + client-heavy main stage |
| Motion (UI) | **Motion** + **GSAP ScrollTrigger** | React-friendly micro-interactions + scrubbed scroll choreography |
| 3D | **React Three Fiber** + **drei** | Per-character WebGL atmospheres (wave field / burst particles / EQ bars) |
| Audio | **Web Audio API** | Parallel looping buffers, analyser-driven visuals, muffled-room filter |
| Styling | **Tailwind CSS 4** | CSS variables for live theme switching via `VibeProvider` |
| Content | **Sanity** (optional) + `mockData` fallback | Ships without CMS credentials |

---

## What's technically interesting

### Parallel audio engine (`useVocaloidAudio`)

All three character tracks decode once, start simultaneously at gain `0`, and crossfade via `GainNode.linearRampToValueAtTime` over **1.2 seconds** — no restarts, no gaps. Routing:

`BufferSource → Gain → Analyser → WaveShaper (easter egg) → BiquadFilter (muffle) → MasterGain`

### Dual visualizer stack

- **Canvas 2D** (`AudioVisualizerCanvas`) — signature 2D treatments per character (Bezier waves / particle kicks / blocky spectrum)
- **WebGL** (`CharacterScene3D`) — instanced meshes and point clouds driven by the same analyser via `useAudioLevels`

### GSAP scroll narrative (`useMainStageGsap`)

ScrollTrigger uses the snap container as `scroller` to scrub hero parallax, title fade, 3D scene scale, and tab panel reveals — disabled when `prefers-reduced-motion` is on.

### Data-driven character effects (`characterEffects.ts`)

Per-character config centralizes default tracks, visualizer mode, R3F scene type, ECG timing, glitch intervals (**20s** / **150ms**), and hero treatment type — so conditionals become lookups, not deletions.

### Accessibility choices

- Audio requires explicit user gesture
- Post-unlock **Audio On/Off** toggle (master gain, not autoplay bypass)
- `prefers-reduced-motion` disables screen shake, GSAP scrub, infinite hero float, and reduces 3D particle counts
- Song links use `data-cursor="record"` for the vinyl morph cursor

---

## Project structure

```
src/
├── app/                  # Next.js routes (/, /shop, /character/*, /song/*)
├── components/
│   ├── r3f/              # React Three Fiber scenes (lazy-loaded, no SSR)
│   ├── CharacterHero.tsx # Signature per-character hero treatments
│   ├── MainStage.tsx     # Snap-scroll stage + GSAP + R3F integration
│   └── ...
├── config/
│   ├── vocaloidData.ts   # Character lore, assets, colors
│   └── characterEffects.ts
├── hooks/
│   ├── useVocaloidAudio.ts
│   ├── useMainStageGsap.ts
│   └── useAudioLevels.ts
└── sanity/               # CMS client + mock fallback
```

---

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
```

Optional Sanity: copy `.env.example` → `.env.local` and set `SANITY_PROJECT_ID`.

---

## Easter egg

Type **TETO** on the main stage to toggle distortion mode on the wave shaper.

---

## License & fan project note

Non-commercial fan archive. Support official Vocaloid releases and creators.

**Maintainer:** [adrielrancepascua-dev](https://github.com/adrielrancepascua-dev)
