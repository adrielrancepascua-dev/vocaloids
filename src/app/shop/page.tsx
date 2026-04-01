import Link from 'next/link';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter-tight selection:bg-[#39C5BB] selection:text-black flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest mb-6">Shop</h1>
      <p className="text-zinc-400 max-w-md mx-auto mb-8">
        This is a fan-curated page. Links to official stores will return soon.
      </p>
      <Link 
        href="/" 
        className="border border-[#39C5BB] text-[#39C5BB] px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#39C5BB] hover:text-black transition-colors"
      >
        Explore songs
      </Link>
    </div>
  );
}
