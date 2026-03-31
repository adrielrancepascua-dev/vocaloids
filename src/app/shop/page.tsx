"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useModal } from '../../contexts/ModalProvider';

export default function ShopPage() {
  const { openModal } = useModal();

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter-tight selection:bg-[#39C5BB] selection:text-black pt-24 pb-12 px-6 md:px-12">
      <Link href="/" className="inline-block mb-12 text-sm uppercase tracking-widest text-[#39C5BB] hover:text-white transition-colors">
         Return Base
      </Link>
      
      <div className="flex justify-between items-end mb-16">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest">
          The Archive Shop
        </h1>
        <button 
          onClick={openModal}
          className="border border-[#39C5BB] text-[#39C5BB] px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#39C5BB] hover:text-black transition-colors"
        >
          Get Free Wallpapers
        </button>
      </div>

      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 tracking-widest border-b border-white/10 pb-4">Digital Goods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 transition-all hover:bg-black/60 hover:border-white/30">
            <div className="aspect-square bg-zinc-900 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
              <span className="text-zinc-600 font-bold tracking-widest">PREVIEW</span>
            </div>
            <h3 className="text-xl font-bold mb-2">SynthV VoiceBank Bundle</h3>
            <p className="text-zinc-400 text-sm mb-6">High-quality tuning presets and custom phonetic dictionaries.</p>
            <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-[#39C5BB] transition-colors">
              Pre-Order - \
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8 tracking-widest border-b border-white/10 pb-4">Affiliate Merch Picks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-zinc-900 rounded-xl mb-4 relative overflow-hidden transition-transform group-hover:-translate-y-2">
                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-zinc-700 text-xs tracking-widest">FIGURE #{item}</span>
                 </div>
              </div>
              <h3 className="font-bold text-sm tracking-widest text-zinc-300 group-hover:text-white transition-colors">1/7 SCALE FIGURE</h3>
              <p className="text-xs text-[#39C5BB]">AmiAmi </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
