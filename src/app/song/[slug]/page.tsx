import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchSongBySlug } from '../../../sanity/client';
import { BackButton } from './BackButton';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const song = await fetchSongBySlug(slug);

  if (!song) return { title: 'Song Not Found' };

  return {
    title: `${song.title} | ${song.vocaloidName} Archive`,
    description: song.description,
  };
}

export default async function SongPage({ params }: Props) {
  const { slug } = await params;
  const song = await fetchSongBySlug(slug);

  if (!song) {
    notFound();
  }

  // Generate MusicRecording JSON-LD for SEO
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": song.title,
    "byArtist": {
      "@type": "MusicGroup",
      "name": song.vocaloidName
    },
    "duration": `PT${song.duration.replace(':', 'M')}S`,
    "datePublished": song.releaseDate,
    "image": song.coverImage
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              <p className="text-xl text-[#39C5BB] font-mono tracking-wider">
                // {song.vocaloidName}
              </p>
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
      </div>
    </>
  );
}