# Vocaloid Interactive Portfolio: Workspace Guide

This document is the definitive guide to the architecture, tech stack, and structural logic of the Vocaloid Interactive Portfolio workspace. It has been updated to reflect the complete environment migration from a Vite SPA to a full-stack Next.js Application.

---

## 1. Overview & Tech Stack
An immersive, highly interactive web application profiling iconic Vocaloids (Hatsune Miku, Kasane Teto, Akita Neru). The application merges "high-end video game UI" aesthetics with visceral animations, seamless audio parallel processing, dynamic SEO, and responsive visual design.

**Core Technologies:**
*   **Framework:** Next.js 16.x (App Router)
*   **Runtime/Library:** React 19, TypeScript
*   **Styling:** Tailwind CSS v4 (via PostCSS), native CSS variables for dynamic theming
*   **Animations:** Framer Motion v12
*   **Audio Engine:** Native Web Audio API (via custom React Hooks & Web Workers)
*   **Content Management (CMS):** Sanity (Headless) integration via `next-sanity`

---

## 2. Directory Structure

```text
/
├── public/                 # Static assets (Audio MP3s, Images, Base Character cutouts)
├── src/
│   ├── app/                # Next.js App Router (Server-side & Pages)
│   │   ├── layout.tsx      # Root provider wrapper (Analytics, Modals)
│   │   ├── page.tsx        # Base endpoint (/) - The Main Stage experience
│   │   ├── shop/           # Shop endpoint (/shop) - Merch & Email conversions
│   │   └── song/[slug]/    # Dynamic SEO endpoints for individual tracks
│   │
│   ├── components/         # Modular UI (Client Components)
│   │   ├── CharacterHero.tsx       # Character display & glitch effects
│   │   ├── CharacterTabs.tsx       # Character Lore, Stats, Top Songs
│   │   ├── YouTubeEmbed.tsx        # Lazy-loaded, accessible YT iframes
│   │   └── AudioVisualizer...      # Canvas-based frequency analyzers
│   │
│   ├── config/             # Hardcoded settings & typescript types
│   ├── constants/          # Theme constants
│   ├── contexts/           # React Context Providers (VibeProvider)
│   ├── hooks/              # Custom Engine hooks (Audio, Performance)
│   ├── lib/                # Utilities (Analytics tracking stubs)
│   ├── sanity/             # CMS Schemas, Client bindings, and mockData fallbacks
│   └── workers/            # Web Workers (audioMath.worker.ts) for off-thread processing
```

---

## 3. Core Architecture Systems

### A. The Next.js App Router & SEO
The application leverages Next.js App Router to allow server-side rendering (SSR) for rich SEO embedding, while preserving intense client-side interactive React components via `"use client"`.
*   **Dynamic Routing (`/song/[slug]`):** Generates dedicated metadata and injects Schema.org JSON-LD (MusicRecording/MediaObject) objects directly into the `<head>` for Google crawlers.
*   **Hybrid Rendering:** Routes like `/shop` and `/` are heavily pre-rendered, providing blazing fast TTFB (Time to First Byte).

### B. The Audio Engine (`useVocaloidAudio.ts` & `audioMath.worker.ts`)
A robust Web Audio API abstraction that bypasses standard HTML5 `<audio>` limitations:
*   **Parallel Execution:** Initializes all 3 music tracks simultaneously in the background (`AudioBufferSourceNode.start()`).
*   **Seamless Crossfading:** Mutes/Unmutes active tracks purely by manipulating `GainNode` amplitudes (via `linearRampToValueAtTime`) over 1.2 seconds based on scroll position.
*   **Worker Offloading:** Heavy byte-frequency analysis (`AnalyserNode.getByteFrequencyData()`) is offloaded to a dedicated Web Worker (`audioMath.worker.ts`). This ensures the massive UI layout and React render thread never drop frames.
*   **The Muffled Filter:** Uses a `BiquadFilterNode` that dynamically drops higher frequencies (low-pass) when the user scrolls into the Data Tabs—simulating listening from "an adjacent room".

### C. Sanity CMS & Mock Data
Prepared for massive content scaling.
*   The system intercepts `SANITY_PROJECT_ID` environment variables.
*   If connected via `.env.local`, it pulls live GROQ queries from a deployed Sanity Content Lake.
*   If local/unconnected, it perfectly falls back to `src/sanity/mockData.ts`, loading mock models of Hatsune Miku, Kasane Teto, and Akita Neru alongside 9 distinct track records.

### D. Visual Effects & Performance
*   **Adaptive Performance (`usePerformanceMonitor.ts`):** Calculates 60-frame moving exponential averages. If FPS drops below 55 (e.g. on weaker mobile devices), it toggles an `isLowEnd` flag, downgrading costly Canvas particle calculations.
*   **Global Theming (`VibeProvider.tsx`):** Tracks the user's scroll depth natively and injects variables like `--primary-color` globally via `document.documentElement`, ensuring immediate styling sync across all tabs without complex prop-drilling.

### E. Conversion Hooks
*   **The Shop (`/shop`):** A dedicated route for placeholder fan-curated links.
*   **Analytics Tracker:** A modular wrapper that forwards events (like `embed_play`) to `console.log` during dev.

---

## 4. Workflows & Commands

### Running Locally
```bash
npm install
npm run dev
```
Preview is hosted on `http://localhost:3000`.

### Building for Production
```bash
npm run build
npm run start
```

### Adding a New Song
1. Add the metadata to `src/sanity/mockData.ts` (Title, bio, audio URI, `embedUrl` out to YouTube, etc).
2. Wire it sequentially to the character arrays.
3. The rest is completely automated: The app will update the hero UI, spawn the dynamic URL endpoint, configure the YouTube Iframe wrapper, and update the Schema.org JSON.

### Resetting Next.js Cache
Occasionally, if mock data edits do not reflect due to hard disk caching, flush the `.next` environment:
**(Windows PowerShell):**
```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue; npm run dev
```