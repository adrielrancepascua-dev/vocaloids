import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { createOrganizationSchema } from '@/lib/jsonld';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vocaloidportfolio.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Vocaloid Interactive Portfolio | Hatsune Miku, Kasane Teto, Akita Neru',
  description: 'An immersive interactive portfolio featuring iconic Vocaloids. Explore the stories, music, and lore of Hatsune Miku, Kasane Teto, and Akita Neru through an engaging digital experience.',
  keywords: ['Vocaloid', 'Hatsune Miku', 'Kasane Teto', 'Akita Neru', 'Synthetic Music', 'Digital Singing', 'Music Production'],
  authors: [{ name: 'Adriel Rance Pascua' }],
  creator: 'Adriel Rance Pascua',
  publisher: 'Adriel Rance Pascua',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'Vocaloid Interactive Portfolio',
    description: 'Explore the immersive world of iconic Vocaloids',
    siteName: 'Vocaloid Interactive Portfolio',
    images: [
      {
        url: `${baseUrl}/images/miku-placeholder.jpg`,
        width: 1200,
        height: 630,
        alt: 'Hatsune Miku',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vocaloid Interactive Portfolio',
    description: 'Explore iconic Vocaloids and their music',
    creator: '@vocaloidportal',
    images: [`${baseUrl}/images/miku-placeholder.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = createOrganizationSchema(baseUrl);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#09090b" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="canonical" href={baseUrl} />
        
        {/* JSON-LD Schema for Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
