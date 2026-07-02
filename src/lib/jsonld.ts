/**
 * JSON-LD Schema helpers for structured data
 * These provide standardized semantic markup for search engines
 */

export interface JsonLdPerson {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  description?: string;
  url?: string;
  image?: string;
  sameAs?: string[];
}

export interface JsonLdMusicArtist {
  '@context': 'https://schema.org';
  '@type': 'MusicGroup';
  name: string;
  description?: string;
  url?: string;
  image?: string;
  sameAs?: string[];
  genre?: string[];
}

export interface JsonLdSong {
  '@context': 'https://schema.org';
  '@type': 'MusicRecording';
  name: string;
  description?: string;
  url?: string;
  image?: {
    '@type': 'ImageObject';
    url: string;
    width: number;
    height: number;
  };
  byArtist: {
    '@type': 'MusicGroup';
    name: string;
  };
  duration?: string;
  datePublished?: string;
  inLanguage?: string;
}

export interface JsonLdBreadcrumb {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface JsonLdWebPage {
  '@context': 'https://schema.org';
  '@type': 'WebPage';
  name: string;
  description?: string;
  url: string;
  image?: string;
  isPartOf?: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
  datePublished?: string;
  dateModified?: string;
  mainEntity?: any;
}

export interface JsonLdWebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  image?: string;
  sameAs?: string[];
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    query_input?: string;
  };
}

/**
 * Create organization schema for the main site
 */
export function createOrganizationSchema(baseUrl: string): JsonLdWebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vocaloid Interactive Portfolio',
    url: baseUrl,
    description: 'An immersive portfolio featuring iconic Vocaloids: Hatsune Miku, Kasane Teto, and Akita Neru.',
    image: `${baseUrl}/images/og-image.jpg`,
    sameAs: [
      'https://twitter.com/vocaloid',
      'https://www.youtube.com/c/VocaloidChannel',
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}?q={search_term_string}`,
      },
      query_input: 'required name=search_term_string',
    },
  };
}

/**
 * Create character schema
 */
export function createCharacterSchema(
  name: string,
  description: string,
  image: string,
  baseUrl: string,
  slug: string
): JsonLdMusicArtist {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name,
    description,
    url: `${baseUrl}/${slug}`,
    image: image.startsWith('http') ? image : `${baseUrl}${image}`,
    sameAs: [],
    genre: ['Vocaloid', 'Synthetic Music'],
  };
}

/**
 * Create song schema
 */
export function createSongSchema(
  title: string,
  description: string,
  vocaloidName: string,
  image: string,
  baseUrl: string,
  slug: string,
  duration?: string,
  releaseDate?: string
): JsonLdSong {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: title,
    description,
    url: `${baseUrl}/song/${slug}`,
    image: {
      '@type': 'ImageObject',
      url: image.startsWith('http') ? image : `${baseUrl}${image}`,
      width: 1200,
      height: 630,
    },
    byArtist: {
      '@type': 'MusicGroup',
      name: vocaloidName,
    },
    duration: duration ? `PT${duration.replace(':', 'M')}S` : undefined,
    datePublished: releaseDate,
    inLanguage: 'en-US',
  };
}

/**
 * Create breadcrumb schema
 */
export function createBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>,
  baseUrl: string
): JsonLdBreadcrumb {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url || baseUrl,
    })),
  };
}

/**
 * Render JSON-LD script tag
 */
export function renderJsonLd(schema: any): string {
  return JSON.stringify(schema);
}
