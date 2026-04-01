export const mockCharacters = [
  {
    slug: 'miku',
    name: 'Hatsune Miku',
    bio: 'The first Vocaloid character of the Vocaloid2 series.',
    origin: 'Crypton Future Media',
    image: '/images/miku-placeholder.jpg',
    topSongs: [
      { title: 'World is Mine', slug: 'world-is-mine', duration: '4:15' },      
      { title: 'Tell Your World', slug: 'tell-your-world', duration: '4:20' },  
      { title: 'Mesmerizer', slug: 'mesmerizer', duration: '3:30' }
    ]
  },
  {
    slug: 'teto',
    name: 'Kasane Teto',
    bio: 'Originally created as a joke for April Fools, now a beloved UTAU/SynthV.',
    origin: '2channel',
    image: '/images/teto-placeholder.jpg',
    topSongs: [
      { title: 'Liar Dancer', slug: 'liar-dancer', duration: '3:05' },
      { title: 'Kasane Territory', slug: 'kasane-territory', duration: '3:45' },
      { title: 'Machine Love', slug: 'machine-love', duration: '3:20' }
    ]
  },
  {
    slug: 'neru',
    name: 'Akita Neru',
    bio: 'A derivative fan-made character representing the "bored" or "quitting" users.',
    origin: '2channel',
    image: '/images/neru-placeholder.jpg',
    topSongs: [
      { title: 'Flop Era', slug: 'flop-era', duration: '3:05' },
      { title: 'Stop Nagging Me', slug: 'stop-nagging-me-2', duration: '3:10' },
      { title: 'Zako', slug: 'zako', duration: '3:00' }
    ]
  }
];

export const mockSongs = [
  {
    slug: 'world-is-mine',
    title: 'World is Mine',
    description: 'The iconic diva anthem by ryo (supercell).',
    vocaloidName: 'Hatsune Miku',
    vocaloidSlug: 'miku',
    audioUrl: '/audio/miku.mp3',
    producer: 'ryo (supercell)',
    bpm: '175',
    originalUpload: 'Nico Nico Douga',
    lore: "Considered one of the most famous Vocaloid songs of all time, 'World is Mine' portrays Miku as a selfish but lovable princess. It essentially established the archetype for many Vocaloid persona songs going forward and popularized the genre immensely.",
    coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fb1a78ee9?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2008-05-31',
    duration: '4:15',
    tags: ['Pop', 'Iconic', 'Diva']
  },
  {
    slug: 'tell-your-world',
    title: 'Tell Your World',
    description: 'A global classic produced by kz (livetune) that connected the entire world.',
    vocaloidName: 'Hatsune Miku',
    vocaloidSlug: 'miku',
    audioUrl: '',
    producer: 'kz (livetune)',
    bpm: '130',
    originalUpload: 'YouTube (Google Chrome Japan Ad)',
    lore: "'Tell Your World' served as the theme song for a Google Chrome commercial in Japan. Its lyrical themes of connecting creators and viewers across the globe through music perfectly encapsulated the spirit of the Vocaloid community.",
    coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fb1a78ee9?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2012-01-18',
    duration: '4:20',
    tags: ['Electronic', 'EDM', 'Global']
  },
  {
    slug: 'mesmerizer',
    title: 'Mesmerizer',
    description: 'A massive modern hit by Satsuki featuring chaotic vocal interplay.',
    vocaloidName: 'Hatsune Miku',
    vocaloidSlug: 'miku',
    audioUrl: '',
    producer: 'Satsuki',
    bpm: '180',
    originalUpload: 'YouTube & NND',
    lore: "Boasting hyper-fast lyric delivery and intense melodic arrangements, 'Mesmerizer' is a testament to the modern era of Vocaloid tuning. It pairs Miku with Teto for a rapidly shifting, overwhelming duet.",
    coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fb1a78ee9?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-04-27',
    duration: '3:30',
    tags: ['Pop', 'Chaotic', 'Duet']
  },
  {
    slug: 'liar-dancer',
    title: 'Liar Dancer',
    description: 'An aggressive modern masterpiece from Masarada utilizing Teto SynthV.',
    vocaloidName: 'Kasane Teto',
    vocaloidSlug: 'teto',
    audioUrl: '',
    producer: 'Masarada',
    bpm: '155',
    originalUpload: 'YouTube / NND',
    lore: "A stellar showcase of the Kasane Teto Synthesizer V voicebank, 'Liar Dancer' shocked the community with its incredibly realistic and powerful vocal tuning, driving a new wave of popularity for Teto.",
    coverImage: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-01-01',
    duration: '3:05',
    tags: ['Electro', 'SynthV', 'Modern']
  },
  {
    slug: 'kasane-territory',
    title: 'Kasane Territory',
    description: 'A catchy, high-energy track introducing Teto to the world.',
    vocaloidName: 'Kasane Teto',
    vocaloidSlug: 'teto',
    audioUrl: '/audio/teto.mp3',
    producer: 't.a.m.',
    bpm: '160',
    originalUpload: 'Nico Nico Douga',
    lore: "Based heavily on standard meme song structures of early NND, this original character theme instantly cemented Teto's presence alongside the major Crypton Vocaloids despite being a fan-generated UTAU.",
    coverImage: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2010-04-01',
    duration: '3:45',
    tags: ['UTAU', 'Meme', 'Upbeat']
  },
  {
    slug: 'machine-love',
    title: 'Machine Love',
    description: 'A captivating track matching intense mechanical aesthetics.',
    vocaloidName: 'Kasane Teto',
    vocaloidSlug: 'teto',
    audioUrl: '',
    producer: 'Masarada',
    bpm: '148',
    originalUpload: 'YouTube / NND',
    lore: "A thematic exploration of artificial emotion and digital bounds, perfectly exploiting Teto's distinctly robotic yet expressive UTAU legacy. It is beloved for its striking visual presentation and hard-hitting basslines.",
    coverImage: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-05-15',
    duration: '3:20',
    tags: ['UTAU', 'SynthV', 'Mechanical']
  },
  {
    slug: 'flop-era',
    title: 'Flop Era',
    description: 'A rebellious anthem capturing the essence of teenage frustration.',
    vocaloidName: 'Akita Neru',
    vocaloidSlug: 'neru',
    audioUrl: '',
    producer: 'Neru Community',
    bpm: '190',
    originalUpload: 'Nico Nico Douga',
    lore: "Leaning heavily into Neru's origin as the 'bored' or 'hater' Vocaloid user representation, this track tackles feelings of internet burnout, creative block, and rejecting modern trends.",
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2024-08-20',
    duration: '3:05',
    tags: ['Rock', 'Edgy', 'Derivative']
  },
  {
    slug: 'stop-nagging-me-2',
    title: 'Stop Nagging Me',
    description: 'A heavy, angry electronic rock song representing frustration.',
    vocaloidName: 'Akita Neru',
    vocaloidSlug: 'neru',
    audioUrl: '/audio/neru.mp3',
    producer: 'Owata-P',
    bpm: '150',
    originalUpload: 'Nico Nico Douga',
    lore: "Originally sung by Rin, the Neru cover/association of 'Stop Nagging Me' (Buchigire) fits her apathetic persona flawlessly. It is widely considered her staple fan-canon theme for shutting out internet noise.",
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2012-08-14',
    duration: '3:10',
    tags: ['Metal', 'Angry', 'Derivative']
  },
  {
    slug: 'zako',
    title: 'Zako',
    description: 'A classic mocking theme reflecting 2channel forum culture.',
    vocaloidName: 'Akita Neru',
    vocaloidSlug: 'neru',
    audioUrl: '',
    producer: 'Various Authors',
    bpm: '140',
    originalUpload: 'Nico Nico Douga',
    lore: "The title translates affectionately to 'small fry' or 'weakling'. Neru playfully taunts the listener, recalling her origins as a literal internet troll mascot born out of 2chan's anti-Miku movement.",
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2009-01-01',
    duration: '3:00',
    tags: ['Rock', 'Troll', 'Derivative']
  }
];
