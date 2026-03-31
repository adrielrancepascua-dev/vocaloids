export const mockCharacters = [
  {
    slug: 'miku',
    name: 'Hatsune Miku',
    bio: 'The first Vocaloid character of the Vocaloid2 series.',
    origin: 'Yamaha Corporation',
    image: '/images/miku-placeholder.jpg',
    topSongs: [
      { title: 'World is Mine', slug: 'world-is-mine', duration: '4:15' },
      { title: 'Melt', slug: 'melt', duration: '4:20' }
    ]
  },
  {
    slug: 'teto',
    name: 'Kasane Teto',
    bio: 'Originally created as a joke for April Fools, now a beloved UTAU/SynthV.',
    origin: '2channel',
    image: '/images/teto-placeholder.jpg',
    topSongs: [
      { title: 'Kasane Territory', slug: 'kasane-territory', duration: '3:45' },
      { title: 'Fukkireta', slug: 'fukkireta', duration: '3:20' }
    ]
  },
  {
    slug: 'neru',
    name: 'Akita Neru',
    bio: 'A derivative fan-made character representing the "bored" or "quitting" users.',
    origin: '2channel',
    image: '/images/neru-placeholder.jpg',
    topSongs: [
      { title: 'Gucha Gucha Uruse', slug: 'gucha-gucha-uruse', duration: '3:10' },
      { title: 'Stop Nagging Me!', slug: 'stop-nagging-me', duration: '3:05' }
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
    coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fb1a78ee9?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2008-05-31',
    duration: '4:15',
    tags: ['Pop', 'Iconic', 'Diva']
  },
  {
    slug: 'kasane-territory',
    title: 'Kasane Territory',
    description: 'A catchy, high-energy track introducing Teto to the world.',
    vocaloidName: 'Kasane Teto',
    vocaloidSlug: 'teto',
    audioUrl: '/audio/teto.mp3',
    coverImage: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2010-04-01',
    duration: '3:45',
    tags: ['UTAU', 'Meme', 'Upbeat']
  },
  {
    slug: 'gucha-gucha-uruse',
    title: 'Gucha Gucha Uruse',
    description: 'A heavy, angry electronic rock song representing frustration.',
    vocaloidName: 'Akita Neru',
    vocaloidSlug: 'neru',
    audioUrl: '/audio/neru.mp3',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2012-08-14',
    duration: '3:10',
    tags: ['Rock', 'Angry', 'Derivative']
  },
  // Adding placeholders for secondary songs
  {
    slug: 'melt',
    title: 'Melt',
    description: 'A sweet pop/rock love song.',
    vocaloidName: 'Hatsune Miku',
    vocaloidSlug: 'miku',
    audioUrl: '',
    coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fb1a78ee9?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2007-12-07',
    duration: '4:20',
    tags: ['Pop', 'Classic']
  },
  {
    slug: 'fukkireta',
    title: 'Fukkireta',
    description: 'A super bouncy, joyful song associated with head-bobbing.',
    vocaloidName: 'Kasane Teto',
    vocaloidSlug: 'teto',
    audioUrl: '',
    coverImage: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2010-05-15',
    duration: '3:20',
    tags: ['UTAU', 'Remix']
  },
  {
    slug: 'stop-nagging-me',
    title: 'Stop Nagging Me!',
    description: 'Another rebellious anthem.',
    vocaloidName: 'Akita Neru',
    vocaloidSlug: 'neru',
    audioUrl: '',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    releaseDate: '2011-11-20',
    duration: '3:05',
    tags: ['Rock', 'Fast']
  }
];
