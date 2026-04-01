import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { createCharacterSchema, createBreadcrumbSchema } from '@/lib/jsonld';
import { generateSeoMetadata } from '@/components/SEO';
import { mockSongs } from '@/sanity/mockData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vocaloidportfolio.vercel.app';
const slug = 'teto';
const characterName = 'Kasane Teto';
const characterDesc = 'Kasane Teto began as a playful internet meme and evolved into a beloved utaite-style character with a passionate fanbase.';
const ogImage = '/images/teto-placeholder.jpg';
const canonicalUrl = `${baseUrl}/character/${slug}`;

export const metadata: Metadata = generateSeoMetadata({
  title: `${characterName} - Vocaloid Profile`,
  description: characterDesc,
  keywords: ['Kasane Teto', 'UTAU', 'SynthV', 'Singing Synthesis', 'Internet Meme', 'Vocaloid'],
  ogImage: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
  ogType: 'profile',
  ogUrl: canonicalUrl,
  canonicalUrl,
});

export default function TetoPage() {
  const characterSchema = createCharacterSchema(
    characterName,
    characterDesc,
    ogImage,
    baseUrl + '/character',
    slug
  );

  const breadcrumbSchema = createBreadcrumbSchema(
    [
      { name: 'Home', url: baseUrl },
      { name: 'Characters', url: `${baseUrl}/#characters` },
      { name: characterName },
    ],
    baseUrl
  );

  const relatedSongs = mockSongs.filter(s => s.vocaloidSlug === slug);

  return (
    <>
      <Script
        id={`${slug}-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(characterSchema) }}
      />
      <Script
        id={`${slug}-breadcrumb-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="min-h-screen bg-zinc-950 text-white font-inter-tight p-6 md:p-12 pt-24 selection:bg-[#E94B73] selection:text-black">
        <article className="max-w-4xl mx-auto flex flex-col gap-12 items-start mt-8">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest text-xs font-bold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back Home
          </Link>
          
          <div className="w-full flex justify-center mb-8">
            <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-[#E94B73]/20 shadow-[0_0_30px_rgba(233,75,115,0.2)]">
              <Image
                src={ogImage}
                alt={`Portrait of ${characterName}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>

          <div className="flex-1 w-full text-zinc-300 leading-relaxed space-y-8 prose prose-invert prose-pink max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-6 border-b border-[#E94B73]/20 pb-4">
              {characterName}
            </h1>

            <p className="text-xl italic border-l-4 border-[#E94B73] pl-4 py-2 bg-[#E94B73]/5 rounded-r w-fit">
              <strong>{characterName}</strong> began as a playful internet meme and evolved into a beloved utaite-style character with a passionate fanbase. Originally created outside official Vocaloid channels, Teto's popularity grew through community creativity, fan-made voicebanks, and a distinctive personality that blends charm, mischief, and musical versatility.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Origin and History</h2>
            <p>
              Teto's origin story is rooted in early internet culture. She emerged from a community joke that turned into a full-fledged character with fan-produced voicebanks and artwork. Over time, Teto gained recognition alongside official Vocaloids, with producers and fans composing original songs and arranging covers that highlight her unique timbre and playful persona.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Notable Songs and Producers</h2>
            <p>
              Teto's catalog is eclectic, often leaning into rock, pop, and quirky experimental tracks. Producers in the doujin and indie scenes embraced her as a flexible vocal instrument. When searching for "Kasane Teto origin" or "Teto songs," you'll find a mix of fan tributes, original compositions, and collaborative projects that celebrate her grassroots beginnings.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Visual Style and Fandom</h2>
            <p>
              Teto is commonly depicted with short, reddish hair and a playful expression. Her visual identity varies widely because she is a community-driven character; fans reinterpret her across styles from punk to pastel kawaii. The fandom is tightly knit and creative, producing animations, comics, and live performances that keep Teto culturally active.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Community and Cultural Role</h2>
            <p>
              Teto represents the power of fan creation. Unlike commercially produced Vocaloids, she demonstrates how communities can invent and sustain a character through shared passion. Her presence in fan conventions and online events highlights the collaborative spirit of the Vocaloid ecosystem.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Trivia and Aliases</h2>
            <p>
              Teto's backstory includes playful myths and community lore. She is sometimes referenced in crossover projects and fan-made media. Because she originated as a meme, her fandom often embraces humor and meta-commentary, which fuels creative reinterpretations.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Further Listening and Links</h2>
            <p>
              Explore fan compilations and indie labels for standout Teto tracks. Look for community playlists that showcase her range, and follow fan hubs to discover new remixes and collaborative releases.
            </p>
          </div>

          {/* Related Songs Block */}
          <div className="w-full mt-16 pt-16 border-t border-white/10">
            <h2 className="text-3xl font-bold uppercase tracking-widest text-white mb-8 text-center text-[#E94B73]">
              Top Tracks featuring {characterName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSongs.map(song => (
                <Link key={song.slug} href={`/song/${song.slug}`} className="group block">
                  <div className="bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-[#E94B73]/50 hover:bg-zinc-800/80">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image 
                        src={song.coverImage || ogImage} 
                        alt={song.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[#E94B73] transition-colors line-clamp-1">{song.title}</h3>
                      <p className="text-zinc-400 text-sm font-mono mb-2">bpm {song.bpm} | {song.duration}</p>
                      <p className="text-zinc-500 text-xs line-clamp-2">{song.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>
    </>
  );
}