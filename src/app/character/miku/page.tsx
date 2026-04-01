import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { createCharacterSchema, createBreadcrumbSchema } from '@/lib/jsonld';
import { generateSeoMetadata } from '@/components/SEO';
import { mockSongs } from '@/sanity/mockData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vocaloidportfolio.vercel.app';
const slug = 'miku';
const characterName = 'Hatsune Miku';
const characterDesc = 'Hatsune Miku is a virtual singing voice and cultural icon whose teal twin-tails and crystalline voice have defined modern Vocaloid fandom.';
const ogImage = '/images/miku-placeholder.jpg';
const canonicalUrl = `${baseUrl}/character/${slug}`;

export const metadata: Metadata = generateSeoMetadata({
  title: `${characterName} - Vocaloid Profile`,
  description: characterDesc,
  keywords: ['Hatsune Miku', 'Vocaloid', 'Crypton Future Media', 'Singing Synthesis', 'Virtual Idol'],
  ogImage: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
  ogType: 'profile',
  ogUrl: canonicalUrl,
  canonicalUrl,
});

export default function MikuPage() {
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
      
      <main className="min-h-screen bg-zinc-950 text-white font-inter-tight p-6 md:p-12 pt-24 selection:bg-[#39C5BB] selection:text-black">
        <article className="max-w-4xl mx-auto flex flex-col gap-12 items-start mt-8">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest text-xs font-bold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back Home
          </Link>
          
          <div className="w-full flex justify-center mb-8">
            <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-[#39C5BB]/20 shadow-[0_0_30px_rgba(57,197,187,0.2)]">
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

          <div className="flex-1 w-full text-zinc-300 leading-relaxed space-y-8 prose prose-invert prose-emerald max-w-none">
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-6 border-b border-[#39C5BB]/20 pb-4">
              {characterName}
            </h1>

            <p className="text-xl italic border-l-4 border-[#39C5BB] pl-4 py-2 bg-[#39C5BB]/5 rounded-r w-fit">
              <strong>{characterName}</strong> is a virtual singing voice and cultural icon whose teal twin-tails and crystalline voice have defined modern Vocaloid fandom. Launched in 2007, Miku quickly became the most recognizable Vocaloid persona, inspiring thousands of songs, live holographic concerts, fan art, and international collaborations. Her presence spans music, animation, merchandise, and community-driven creativity.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Origin and History</h2>
            <p>
              Miku was developed by Crypton Future Media using Yamaha's Vocaloid engine. Designed as a voicebank and character package, she was intended to give creators an accessible, expressive singing voice. Over time, Miku evolved from a software product into a global phenomenon. Early viral tracks and producer communities helped her cross language barriers, and her holographic concerts demonstrated how a virtual artist can headline real-world stages.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Notable Songs and Producers</h2>
            <p>
              Miku's catalog is vast and varied. Producers such as ryo, kz, and livetune helped shape her early sound, while countless independent creators expanded her stylistic range. Notable tracks often associated with Miku include emotionally resonant ballads, high-energy pop, and experimental electronic pieces. When searching for "Hatsune Miku top songs," expect to find a mix of classic hits and modern fan favorites that showcase her vocal flexibility.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Visual Style and Fandom</h2>
            <p>
              Visually, Miku is defined by her teal color palette, futuristic outfit, and twin-tails. Fans interpret and reimagine her across genres—idol, cyberpunk, gothic, and casual everyday styles. The fandom is collaborative and prolific: illustrators, animators, choreographers, and musicians contribute to a living archive of Miku content. Cosplayers and live performers bring her designs into physical spaces, while online communities coordinate remixes and cover projects.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Impact and Cultural Reach</h2>
            <p>
              Miku's influence extends beyond music. She has appeared in brand campaigns, video games, and international festivals. Her concerts, using projection and motion capture, proved that virtual performers can create emotional, communal experiences. Educational projects and creative tools built around Miku have also introduced new generations to music production and digital art.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Trivia and Aliases</h2>
            <p>
              Fans sometimes refer to Miku with affectionate nicknames and shorthand. Her official name remains "Hatsune Miku," but regional communities may use localized spellings or nicknames. Trivia includes collaborations with mainstream artists, appearances in advertising, and the fact that her voicebank has been updated and remixed by many producers over the years.
            </p>

            <h2 className="text-2xl font-bold text-white uppercase tracking-wider mt-12 mb-4">Further Listening and Links</h2>
            <p>
              For newcomers, start with a curated playlist of classic and modern Miku tracks to appreciate her range. Explore producer pages and fan compilations to see how different creators shape her voice. Use the site's song pages to jump from character profile to individual recordings and back again.
            </p>
          </div>

          {/* Related Songs Block */}
          <div className="w-full mt-16 pt-16 border-t border-white/10">
            <h2 className="text-3xl font-bold uppercase tracking-widest text-white mb-8 text-center text-[#39C5BB]">
              Top Tracks featuring {characterName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSongs.map(song => (
                <Link key={song.slug} href={`/song/${song.slug}`} className="group block">
                  <div className="bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-[#39C5BB]/50 hover:bg-zinc-800/80">
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
                      <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[#39C5BB] transition-colors line-clamp-1">{song.title}</h3>
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