import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchSongBySlug, fetchRelatedSongs } from '../../../sanity/client';
import { createSongSchema, createBreadcrumbSchema } from '@/lib/jsonld';
import { BackButton } from './BackButton';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vocaloidportfolio.vercel.app';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const song = await fetchSongBySlug(slug);

  if (!song) return { title: 'Song Not Found' };

  const songUrl = `${baseUrl}/song/${song.slug}`;
  const ogImage = song.coverImage?.startsWith('http') ? song.coverImage : `${baseUrl}${song.coverImage}`;

  return {
    metadataBase: new URL(baseUrl),
    title: `${song.title} by ${song.vocaloidName}`,
    description: song.description || `Listen to ${song.title} by ${song.vocaloidName}`,
    keywords: [song.title, song.vocaloidName, 'Vocaloid', 'Music', 'Singing Synthesis', song.tags?.join(', ') || ''].filter(Boolean),
    authors: [{ name: song.producer || song.vocaloidName }],
    openGraph: {
      type: 'music.song',
      url: songUrl,
      title: `${song.title} by ${song.vocaloidName}`,
      description: song.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: song.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${song.title} by ${song.vocaloidName}`,
      description: song.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: songUrl,
    },
  };
}

export default async function SongPage({ params }: Props) {
  const { slug } = await params;
  const song = await fetchSongBySlug(slug);

  if (!song) {
    notFound();
  }

  const relatedSongs = await fetchRelatedSongs(song.vocaloidSlug, song.slug);

  // Generate comprehensive JSON-LD schemas
  const songSchema = createSongSchema(
    song.title,
    song.description,
    song.vocaloidName,
    song.coverImage,
    baseUrl,
    song.slug,
    song.duration,
    song.releaseDate
  );

  const breadcrumbSchema = createBreadcrumbSchema(
    [
      { name: 'Home', url: baseUrl },
      { name: song.vocaloidName, url: `${baseUrl}/character/${song.vocaloidSlug}` },
      { name: song.title },
    ],
    baseUrl
  );

  return (
    <>
      <Script
        id="song-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(songSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-zinc-950 text-white font-inter-tight p-6 md:p-12 pt-24 selection:bg-[#39C5BB] selection:text-black">
        <BackButton />
        <article className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-start mt-8">
          <div className="w-full md:w-1/3 relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-2xl">
            {song.coverImage ? (
              <Image
                src={song.coverImage}
                alt={song.title}
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600">No Image</div>
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-2">
                {song.title}
              </h1>
              <Link 
                href={`/character/${song.vocaloidSlug}`} 
                className="text-xl text-[#39C5BB] font-mono tracking-wider hover:text-white transition-colors flex items-center gap-2 group w-fit"
                title={`View ${song.vocaloidName} profile`}
              >
                // {song.vocaloidName}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>

            <p className="text-zinc-300 text-lg leading-relaxed mb-8 italic border-l-2 border-[#39C5BB] pl-4">
              "{song.description}"
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-black/50 border border-white/5 rounded-xl p-4 transition-colors hover:bg-black/80">
                <span className="block text-xs tracking-widest text-zinc-500 mb-1 uppercase">Producer</span>
                <span className="font-mono text-zinc-200">{song.producer || 'Unknown'}</span>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-xl p-4 transition-colors hover:bg-black/80">
                <span className="block text-xs tracking-widest text-zinc-500 mb-1 uppercase">Duration</span>
                <span className="font-mono text-zinc-300">{song.duration}</span>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-xl p-4 transition-colors hover:bg-black/80">
                <span className="block text-xs tracking-widest text-zinc-500 mb-1 uppercase">Origin</span>
                <span className="font-mono text-zinc-300">{song.originalUpload || 'N/A'}</span>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-xl p-4 transition-colors hover:bg-black/80">
                <span className="block text-xs tracking-widest text-zinc-500 mb-1 uppercase">BPM</span>
                <span className="font-mono text-zinc-300">{song.bpm || 'N/A'}</span>
              </div>
            </div>

            {song.lore && (
              <div className="mb-8 p-6 bg-zinc-900/50 border border-white/5 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">Song Lore & History</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {song.lore}
                </p>
              </div>
            )}

            {song.tags && song.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {song.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-[#39C5BB]/10 text-[#39C5BB] border border-[#39C5BB]/20 rounded-full text-xs tracking-widest uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Related Songs Block */}
        {relatedSongs && relatedSongs.length > 0 && (
          <section className="max-w-4xl mx-auto mt-16 pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-[#39C5BB] mb-8">
              More by {song.vocaloidName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSongs.map((relatedSong: any) => (
                <Link key={relatedSong.slug} href={`/song/${relatedSong.slug}`} className="group block">
                  <div className="bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-[#39C5BB]/50 hover:bg-zinc-800/80">
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image 
                        src={relatedSong.coverImage || (song.coverImage?.startsWith('http') ? song.coverImage : `${baseUrl}${song.coverImage}`)} 
                        alt={relatedSong.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-1 group-hover:text-[#39C5BB] transition-colors line-clamp-1">{relatedSong.title}</h3>
                      <p className="text-zinc-400 text-xs font-mono mb-2">bpm {relatedSong.bpm || 'N/A'} | {relatedSong.duration}</p>
                      <p className="text-zinc-500 text-xs line-clamp-2">{relatedSong.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}