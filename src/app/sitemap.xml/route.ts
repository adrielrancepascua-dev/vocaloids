import { mockCharacters, mockSongs } from '@/sanity/mockData';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://vocaloidportfolio.vercel.app';

export async function GET() {
  const sitemap = generateSitemap();
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function generateSitemap(): string {
  const pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }> = [
    // Main pages
    { url: BASE_URL, lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
    
    // Character pages
    ...mockCharacters.map(character => ({
      url: `${BASE_URL}/character/${character.slug}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly' as const,
      priority: 0.9,
    })),
    
    // Song pages
    ...mockSongs.map(song => ({
      url: `${BASE_URL}/song/${song.slug}`,
      lastmod: song.releaseDate || new Date().toISOString().split('T')[0],
      changefreq: 'yearly' as const,
      priority: 0.7,
    })),
  ];

  const xmlEntries = pages
    .map(
      page => `
  <url>
    <loc>${escapeXml(page.url)}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlEntries}
</urlset>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
}
