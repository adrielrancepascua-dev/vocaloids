import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { createCharacterSchema, createBreadcrumbSchema } from '@/lib/jsonld';
import { generateSeoMetadata } from '@/components/SEO';
import { mockSongs } from '@/sanity/mockData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vocaloidportfolio.vercel.app';
const slug = 'neru';
const characterName = 'Akita Neru';
const characterDesc = 'Akita Neru is a fan-created character who gained traction for her sardonic personality and distinctive voice.';
const ogImage = '/images/neru-placeholder.jpg';
const canonicalUrl = `${baseUrl}/character/${slug}`;

export const metadata: Metadata = generateSeoMetadata({
  title: `${characterName} - Vocaloid Profile`,
  description: characterDesc,
  keywords: ['Akita Neru', 'Vocaloid', 'Fan Made', 'Singing Synthesis', 'Derivative Character'],
  ogImage: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
  ogType: 'profile',
  ogUrl: canonicalUrl,
  canonicalUrl,
});

export default function NeruPage() {
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
      
      <main className="min-h-screen bg-zinc-950 text-white font-inter-tight p-6 md:p-12 pt-24 selection:bg-[#F3C13A] selection:text-black">
        <article className="max-w-4xl mx-auto flex flex-col gap-12 items-start mt-8">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest text-xs font-bold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back Home
          </Link>
          
          <div className="w-full flex justify-center mb-8">
            <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-[#F3C13A]/20 shadow-[0_0_30px_rgba(243,193,58,0.2)]">
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

          <div className="flex-1 w-full text-zinc-300 leading-relaxed space-y-8 prose prose-invert prose-yellow max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-6 border-b border-[#F3C13A]/20 pb-4">
              {characterName}
            </h1>

            <p className="text-xl italic border-l-4 border-[#F3C13A] pl-4 py-2 bg-[#F3C13A]/5 rounded-r w-fit">
              <strong>{characterName}</strong> is a fan-created character who gained traction for her sardonic personality and distinctive voice. Often portrayed as a laid-back, slightly mischievous counterpart to other Vocaloids, Neru's character has inspired a variety of musical styles and fan works that emphasize attitude and narrative-driven songs.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Origin and History</h2>
            <p>
              Neru originated within fan communities and quickly became a recurring figure in doujin music and illustrations. Her persona—wry, sometimes sarcastic—offers a contrast to more idol-like Vocaloids, making her a favorite for storytelling songs and character-driven compositions.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Notable Songs and Producers</h2>
            <p>
              Neru's repertoire often includes rock, alternative, and narrative pop. Producers who favor character-driven storytelling use her voice to convey complex emotions and ironic perspectives. Searching for "Akita Neru songs" will surface tracks that highlight her expressive range and the creative storytelling favored by her community.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Visual Style and Fandom</h2>
            <p>
              Neru's visual interpretations vary, but she is frequently shown with a casual outfit and a slightly disheveled look that matches her personality. Fans create comics, short animations, and music videos that explore her character in humorous and poignant ways. The fandom values narrative depth and character interplay.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Character Role and Influence</h2>
            <p>
              Neru's role in the Vocaloid ecosystem is as a character actor—she excels in songs that require attitude, irony, or a conversational tone. Her presence encourages producers to experiment with lyrical storytelling and genre blending, expanding the expressive possibilities of synthesized vocals.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Further Listening and Links</h2>
            <p>
              To get a sense of Neru's range, listen to narrative-driven tracks and fan-made concept albums. Follow community hubs and playlists to discover new releases and collaborative projects that feature Neru alongside other Vocaloid characters.
            </p>
          </div>

          {/* Related Songs Block */}
          <div className="w-full mt-16 pt-16 border-t border-white/10">
            <h2 className="text-3xl font-bold uppercase tracking-widest text-white mb-8 text-center text-[#F3C13A]">
              Top Tracks featuring {characterName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSongs.map(song => (
                <Link key={song.slug} href={`/song/${song.slug}`} className="group block">
                  <div className="bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-[#F3C13A]/50 hover:bg-zinc-800/80">
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
                      <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[#F3C13A] transition-colors line-clamp-1">{song.title}</h3>
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