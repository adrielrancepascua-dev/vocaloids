import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogUrl?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

/**
 * Generates metadata object for Next.js pages
 * Use this in your page's generateMetadata function
 */
export function generateSeoMetadata(props: SEOProps): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogImage,
    ogType = 'website',
    ogUrl,
    twitterHandle,
    canonicalUrl,
    author,
    publishedDate,
    modifiedDate,
  } = props;

  return {
    title,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      type: ogType,
      url: ogUrl,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
      siteName: 'Vocaloid Interactive Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: twitterHandle,
    },
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots: {
      index: true,
      follow: true,
      googleBot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
    publish_date: publishedDate,
    other: modifiedDate ? { 'last-modified': modifiedDate } : {},
  };
}

/**
 * SEO Component for easy use in any page
 * This is a helper component that renders nothing but provides TypeScript support
 */
export function SEO({ title, description, keywords }: SEOProps) {
  // This component doesn't render anything - use generateSeoMetadata instead
  return null;
}
