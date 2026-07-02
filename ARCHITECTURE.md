# Vocaloid Interactive Portfolio
**Architecture & Design Document**

## 1. Overview & Tech Stack
An immersive, highly interactive single-page portfolio profiling iconic Vocaloids (Hatsune Miku, Kasane Teto, Akita Neru). The application mirrors a "high-end video game intro" with visceral animations, seamless audio transitions, and heavily stylized UI components.

* **Core:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS 4, native CSS variables for dynamic theming
* **Animations:** Framer Motion v12
* **Audio Engine:** Native Web Audio API (via custom React Hook)

---

## 2. Application Architecture

### Theme Management (`VibeProvider.tsx`)
The app uses a global Context (`useVibe`) to manage the `activeCharacter`. Whenever a user scrolls to a new character, the provider intercepts the change and injects global CSS variables (`--primary-color`, secondary gradients, and glow shadows) directly into the `document.documentElement`. This ensures elements system-wide instantly react to the current character's signature color.

### The Audio Engine (`useVocaloidAudio.ts`, `AudioVisualizerCanvas.tsx`, & `audioMath.worker.ts`)
A robust Web Audio API abstraction that bypasses standard HTML5 `<audio>` limitations:
* **Parallel Track Execution:** The engine initializes all tracks simultaneously in the background (using parallel `AudioBufferSourceNode.start()`) running at current time.
* **Seamless Crossfading:** When switching characters, the engine relies solely on manipulating `GainNode` amplitudes via `linearRampToValueAtTime`, bringing the active track to `1` and silencing the others over 1.2 seconds without track restarts.
* **Audio Routing Context:** `AudioBufferSourceNode -> GainNode -> AnalyserNode -> BiquadFilterNode -> Master Gain -> Destination`
* **Default Volume:** `masterGain` defaults to `0.15`.
* **Worker Offloading:** Heavy `Uint8Array` frequency analysis via `AnalyserNode.getByteFrequencyData()` is offloaded to a dedicated Web Worker (`audioMath.worker.ts`), providing low-latency transients for React UI without blocking the main render thread.
* **The "Muffled Room" Filter:** A dynamic `BiquadFilterNode` sits in the path. Defaulting to 24000Hz (full clarity). When the user scrolls down into a character's Data Tabs, it smooth-ramps down to `800Hz` using `exponentialRampToValueAtTime`—audibly shearing off the high frequencies to simulate listening to the concert from an adjacent room.

### Performance & Engine Scaling (`usePerformanceMonitor.ts`)
A dedicated performance monitoring hook designed to manage "Triple-A" tier graphics scaling:
* Calculates a 60-frame moving exponential average of `requestAnimationFrame` deltas.
* Yields a deferred `isLowEnd` flag using React 19's `useDeferredValue` when FPS drops consistently below 55.
* Elements like `AudioVisualizerCanvas.tsx` subscribe to this hook to dynamically downscale visually intense particle limits (e.g., from 150 to 40) avoiding thermal throttling on weaker hardware.

---

## 3. Component Layout & Flow

The user journey operates on a strictly linear, cinematic pipeline:

### Phase 1: The Loading Screen (`LoadingScreen.tsx` & `HeartRateMonitor.tsx`)
* Blocks the entire UI until all simulated/actual assets resolve.
* **The Bio-Monitor:** A clinically accurate ECG visualization taking the place of standard loading bars. It dynamically renders SVG path sweeps representing Normal Sinus Rhythms (Miku, 75 BPM), Tachycardia (Teto, 120 BPM), and Bradycardia (Neru, 55 BPM). The Y-axis path data flexes reactively to the Web Audio API's realtime Bass extraction.
* **The Unlock:** A "Start Experience" button securely unlocks the audio context and transitions `unlocked` to true.
* **The Transition:** Uses Framer Motion's `<AnimatePresence>` to execute a cinematic 800ms fade/blur-out as the overlay is destroyed. 

### Phase 2: The Main Stage (`MainStage.tsx`)
The primary scroll container using CSS Snap scrolling (`snap-y snap-mandatory`). 
* Iterates through the `vocaloidData` array.
* Each Character Section is specifically sized to **`200vh`** to accommodate a strict two-screen narrative.
* **Scroll-Triggered Context:** Utilizes Framer Motion's `useInView` linked to the *entire* 200vh section node (triggering softly at 20% intersection). This prevents theme reversion issues when rapidly scrolling "up" from Character B's tab layout into Character A's tab layout, maintaining correct global audio and color states.
* **Scroll-Triggered Audio Muffle:** A secondary `useInView` monitors specifically the Tab screen triggering at `40%`. Doing so alerts `MainStage` to fire `setMuffleEffect` engaging our BiquadFilter logic.

**Screen 1: The Hero (`CharacterHero.tsx`)**
* Displays the character's massive typography and tagline.
* Universal Character Zoom: The core character `<img />` tags use `object-contain scale-90` sizing parameters to pull their models slightly back allowing maximum UI visibility.
* Implements a Lead Creative Director "immersive terminal" visual noise layout across all factions:
  * **Global Noise Layer:** Includes massive 45vw alpha-transparent background watermarks mapped to character designations (`01`, `04`, `DEN2`).
  * **Global Scanlines:** Projects a recursive `repeating-linear-gradient` CRT overlay bounding over the primary wrapper.
  * **Technical Dossier:** Corners are augmented with static system stats (top corners) and dynamic, reactive hardware stats (bottom corners logging real-time `X, Y` coordinates).
* Re-designed container aesthetics that abandon traditional flat rectangular logic based on lore triggers (`isMiku`, `isTeto`, `isNeru`):
  * **Miku:** Transparent PNG cutout with `drop-shadow` neon values reactive to cursor physics, replacing the spotlight.
  * **Teto:** High-intensity Industrial Glitch, hard-coded caution tape overlay filters, and hardware X-axis jitter algorithms to fake a broken layer boundary.
  * **Neru:** Monospace "Bored" aesthetic enforcing an animated "LOW BATTERY" diagnostic flag overriding the top-right frame paired with mix-blend `feTurbulence` SVG static filters.

**Screen 2: The Data Tabs (`CharacterTabs.tsx`)**
* Accessible by scrolling down from the Hero.
* Implements full-bleed parallax `bgImage` integration overlaid with a deep `bg-black/70 backdrop-blur-md` to ensure UI contrast against visually aggressive wallpapers.
* A darkened data screen containing four strictly customized tabs:
  * **About / Lore:** Injects the narrative description and dynamically mapped `loreMetric`.
  * **Stats Base:** Glassmorphic layout pulling `Age, Height, Weight`, and `Model Status` system flags.
  * **Influence:** Static mapping of visual/audio genre influence parameters.
  * **Top Songs:** Dynamic play count calculations utilizing animated SVG progress bars for "Iconic Audio Data".
* Includes a "Next Character" button at the bottom that uses `scrollIntoView` to seamlessly auto-pan to the next character's Hero section.

---

## 4. Animation & Visual Effects 
*All heavy lifting is done via Framer Motion & CSS tricks.*

* **The Spring Cursor (`CustomCursor.tsx`):** Hand-built cursor using `useMotionValue` and `useSpring`. Mass is set to `0.1` and stiffness to `800` for ultra-snappy responsiveness. It inherits the theme color dynamically. 
* **Dynamic Record SVG:** If you hover over a specific element with `data-cursor="record"`, the cursor scales up and morphs into a spinning SVG vinyl record colored by the active character.
* **Spotlight Card Effect:** Inside the `CharacterHero`, a dynamic radial gradient tracks the `mouseX` and `mouseY` position over the image container, creating a flashlight reveal effect using `WebkitMaskImage`.
* **RGB Splitting Glitch:** Text in the hero utilizes a dual-layer technique. Every 20 seconds, a `useEffect` triggers a state change. For 50 milliseconds, a Red text node shifts -4px and a Blue text node shifts +4px. They snap back instantly, creating a hardware-chromatic aberration (glitch) effect.
* **Fluid Layout Anchoring:** The `CharacterTabs` uses Framer Motion's `layoutId="character-tabs-underline"` to physically animate the glowing underline between tabs when clicked, rather than snapping immediately.