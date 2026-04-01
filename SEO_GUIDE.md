# SEO Optimization Guide

This Next.js project includes comprehensive SEO optimization features to improve search engine visibility and social media sharing.

## Features Implemented

### 1. **Reusable SEO Component** (`src/components/SEO.tsx`)
A TypeScript-first SEO component that provides:
- Title, description, keywords
- Open Graph (OG) meta tags for social media
- Twitter Card tags
- Canonical URLs
- Author and publication date metadata

**Usage:**
```typescript
import { generateSeoMetadata } from '@/components/SEO';

export const generateMetadata = () => {
  return generateSeoMetadata({
    title: 'Your Page Title',
    description: 'Your page description',
    keywords: ['keyword1', 'keyword2'],
    ogImage: 'https://...',
  });
};
```

### 2. **JSON-LD Structured Data** (`src/lib/jsonld.ts`)
Comprehensive schema helpers for:
- **Organization Schema**: Website/company information
- **MusicArtist Schema**: Vocaloid character profiles
- **MusicRecording Schema**: Individual song metadata
- **Breadcrumb Schema**: Navigation hierarchy
- **WebPage Schema**: Generic page information

**Usage in Pages:**
```typescript
import { createSongSchema, createBreadcrumbSchema } from '@/lib/jsonld';
import Script from 'next/script';

const songSchema = createSongSchema(...);
const breadcrumbSchema = createBreadcrumbSchema(...);

<Script id="song-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(songSchema) }} />
<Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
```

### 3. **Dynamic Sitemap Generation** (`src/app/sitemap.xml/route.ts`)
Automatically generates `sitemap.xml` at `/sitemap.xml` containing:
- All static pages (/, /shop)
- All character pages
- All song pages with:
  - Last modified dates
  - Change frequency
  - Priority levels
  - Proper XML escaping

**Access:** `https://yourdomain.com/sitemap.xml`

### 4. **Robots.txt** (`public/robots.txt`)
Configured with:
- Allow/Disallow rules
- Sitemap reference
- User-agent specific crawl delays
- Rate limiting for aggressive bots

### 5. **Meta Tags in Layout** (`src/app/layout.tsx`)
Root layout includes:
- Proper viewport meta tag
- Theme color
- Character set (UTF-8)
- Canonical URLs
- Open Graph and Twitter Card meta tags
- Organization JSON-LD schema
- Apple Touch Icon

### 6. **Page-Specific SEO** (`src/app/song/[slug]/page.tsx`)
Song pages include:
- Unique titles and descriptions
- Image alt text (for accessibility)
- Comprehensive metadata generation
- Music-specific Open Graph tags
- Song and breadcrumb JSON-LD schemas
- Canonical URLs for duplicate prevention

## SEO Best Practices Implemented

✅ **Mobile Responsiveness**
- Viewport meta tag configured
- Mobile-first responsive design

✅ **Image Optimization**
- Next.js Image component with automatic optimization
- Descriptive alt text for all images
- Proper dimensions and loading strategies

✅ **Internal Linking**
- Breadcrumb navigation
- Semantic HTML structure
- Related content links

✅ **Performance**
- Static page pre-rendering
- Dynamic routes server-rendered on demand
- Image optimization
- CSS minification

✅ **Structured Data**
- Multiple JSON-LD schemas
- Google-compliant markup
- Schema.org validated

✅ **Social Media**
- Open Graph meta tags
- Twitter Card tags
- Share-optimized preview images

## Configuration

### Environment Variables
Add to `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

This is used for:
- Canonical URLs
- Absolute image URLs in schemas
- Sitemap generation

### TypeScript Path Aliases
Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Testing SEO

### Validate Markup
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Open Graph Debugger](https://developers.facebook.com/tools/debug/og/object/)

### See Sitemap
Visit `/sitemap.xml` and verify all pages are listed.

### Check Robots.txt
Visit `/robots.txt` and ensure proper configuration.

### Inspect Metadata
Use browser DevTools Element Inspector to verify:
- Meta tags in `<head>`
- JSON-LD scripts
- Canonical tags

## Integration with Search Engines

1. **Google Search Console**
   - Upload sitemap.xml
   - Monitor indexing status
   - Check crawl errors

2. **Bing Webmaster Tools**
   - Submit sitemap
   - Monitor search analytics

3. **Social Media**
   - Test OG tags with share debuggers
   - Verify preview images

## Future Enhancements

- [ ] Implement XML sitemaps for images and videos
- [ ] Add hreflang tags for internationalization
- [ ] Implement breadcrumb schema dynamically
- [ ] Add FAQ schema for common questions
- [ ] Monitor Core Web Vitals (CLS, FID, LCP)
- [ ] Implement analytics tracking for SEO metrics

## Resources

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup)
