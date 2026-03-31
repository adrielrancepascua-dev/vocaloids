export type Vocaloid = {
  name: string;
  tagline: string;
  designation: string;
  system: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  bio: string;
  influences: string[];
  songs: {
    title: string;
    playCount: number;
    year: number;
  }[];
  stats: {
    age: number | string;
    height: string;
    weight: string;
  };
  loreMetric: string;
  modelStatus: string;
  uiSignature: string;
  theme: "miku" | "teto" | "neru";
  audioSrc: string;
  baseImage: string;
  bgImage: string;
};

export const vocaloidData: Vocaloid[] = [
  {
    name: "Hatsune Miku",
    tagline: "Global Icon & The World's Virtual Pop Star",
    designation: "CV01",
    system: "CV01 CRYPTON FUTURE MEDIA",
    colors: {
      primary: "#33CCBB", // Updated UI Signature Teal
      secondary: "#000000",
      accent: "#FF00FF" 
    },
    bio: "Hatsune Miku is a software voicebank developed by Crypton Future Media and its official moe anthropomorph. She uses Yamaha Corporation's Vocaloid voice synthesizing technology and has become a legendary virtual idol.",
    influences: ["J-Pop", "Electronic", "Future Bass"],
    stats: {
      age: 16,
      height: "158cm",
      weight: "42kg"
    },
    loreMetric: "The \"Blank Canvas\" / Eternal Diva.",
    modelStatus: "ACTIVE / V6_HYBRID",
    uiSignature: "Teal, neon glow, digital pulse visualizers.",
    theme: "miku",
    songs: [
      { title: "World is Mine (ryo)", playCount: 15400000, year: 2008 },
      { title: "Tell Your World (kz)", playCount: 12000000, year: 2012 },
      { title: "Mesmerizer (Satsuki)", playCount: 25000000, year: 2024 }
    ],
    audioSrc: "/audio/miku.mp3",
    baseImage: "/images/miku_base.png",
    bgImage: "/images/miku_background.jpg"
  },
  {
    name: "Kasane Teto",
    tagline: "The Chimeric Idol",
    designation: "0401",
    system: "UTAU / SYNTHESIZER V",
    colors: {
      primary: "#FF4444", // Industrial Red
      secondary: "#1A1A1A", 
      accent: "#FF0000" 
    },
    bio: "Kasane Teto is a Japanese UTAU who was originally created as a troll 'Vocaloid' by fans to fool people on April Fools' Day. Over time, she gained immense real popularity.",
    influences: ["Rock", "Mechanical", "Metalcore"],
    stats: {
      age: "31 (Chimera)",
      height: "159.5cm",
      weight: "47kg"
    },
    loreMetric: "Born from a lie, ascended to a Goddess. LIKES: French bread.",
    modelStatus: "SYNTH_V_AI / CHIMERA_OS",
    uiSignature: "Industrial Red, drill-hair geometry, glitch overlays.",
    theme: "teto",
    songs: [
      { title: "Liar Dancer (Masarada)", playCount: 5000000, year: 2024 },
      { title: "Override (Yoshida Yasei)", playCount: 20000000, year: 2023 },
      { title: "Ochame Kinou", playCount: 30000000, year: 2010 }
    ],
    audioSrc: "/audio/teto.mp3",
    baseImage: "/images/teto_base.png",
    bgImage: "/images/teto_background.jpg"
  },
  {
    name: "Akita Neru",
    tagline: "The Anti-Idol",
    designation: "DEN2",
    system: "BOUKALOID / DERIVATIVE",
    colors: {
      primary: "#FFD700", // Safety Yellow
      secondary: "#000000",
      accent: "#FFA500" 
    },
    bio: "Akita Neru is a fan-made character initially created as a troll on 2channel. She is recognized by her side-ponytail and her constant use of a cell phone. 700 yen/hr part-timer.",
    influences: ["Metal", "Industrial", "Grunge"],
    stats: {
      age: 17,
      height: "150cm",
      weight: "38kg"
    },
    loreMetric: "Disinterested, phone-obsessed, 700 yen/hr part-timer.",
    modelStatus: "FANMADE_DERIVATIVE / STANDBY",
    uiSignature: "Safety Yellow, flip-phone motifs, low-battery icons.",
    theme: "neru",
    songs: [
      { title: "Stop Nagging Me! (Owata-P)", playCount: 4500000, year: 2008 },
      { title: "Triple Baka", playCount: 22000000, year: 2008 },
      { title: "Tsumanne?", playCount: 3000000, year: 2009 }
    ],
    audioSrc: "/audio/neru.mp3",
    baseImage: "/images/neru_base.png",
    bgImage: "/images/neru_background.png"
  }
];