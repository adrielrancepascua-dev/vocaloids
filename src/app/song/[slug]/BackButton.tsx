"use client";

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // If there is history, navigate back so we maintain exact scroll position in the main stage.
    // Fallback to home if they opened the link directly.
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button 
      onClick={handleBack}
      className="inline-flex items-center gap-2 mb-12 text-sm uppercase tracking-widest text-[#39C5BB] hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
    >
      <span>&larr;</span> Return Base
    </button>
  );
}