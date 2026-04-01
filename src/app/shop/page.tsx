"use client";
import Link from 'next/link';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter-tight selection:bg-[#39C5BB] pt-24 pb-12 px-6 md:px-12 flex flex-col items-center justify-center text-center">
      <Link href="/" className="inline-block mb-12 text-sm uppercase tracking-widest text-[#39C5BB] hover:text-white transition-colors">
         &larr; Return Home
      </Link>
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">MERCHANDISE</h1>
      <p className="text-zinc-400 max-w-lg mb-8 text-lg">This is a non-commercial fan-curated archive. The shop has been indefinitely suspended to preserve the purity of the project.</p>
      <p className="text-zinc-500 text-sm">Please support official Vocaloid releases and merchandise on their respective platforms.</p>
    </div>
  );
}
