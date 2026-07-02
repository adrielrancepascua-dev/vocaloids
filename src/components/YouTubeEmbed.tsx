"use client";

import { useState } from 'react';

type YouTubeEmbedProps = {
  url: string;
  title: string;
  onPlay?: () => void;
};

// Normalize common YouTube URLs to the /embed/ version with youtube-nocookie
function getEmbedUrl(url: string) {
  let videoId = '';
  try {
    // Check if it's already an embed URL to extract the ID
    if (url.includes('/embed/')) {
      videoId = url.split('/embed/')[1].split('?')[0];
    } else {
      // Regex matches multiple formats:
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = url.match(regex);
      if (match && match[1]) {
        videoId = match[1];
      }
    }
  } catch (e) {
    // Return original url if parsing fails
    return url;
  }

  if (videoId) {
    // Clean any trailing slashes or parameters from videoId extraction
    videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 11);
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
  }
  
  return url;
}

export function YouTubeEmbed({ url, title, onPlay }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlay) {
      onPlay();
    }
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg flex items-center justify-center group">
      {!isPlaying ? (
        <button
          onClick={handlePlay}
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/40 hover:bg-black/20 focus:outline-none focus:ring-4 focus:ring-[#39C5BB] transition-colors cursor-pointer"
          aria-label={`Play ${title} video`}
          title={`Play ${title} video`}
        >
          {/* Play Icon */}
          <div className="w-16 h-16 bg-[#39C5BB]/90 text-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#39C5BB]/20">
            <svg
              className="w-8 h-8 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      ) : (
        <iframe
          src={embedUrl}
          title={`${title} Official Video`}
          className="absolute top-0 left-0 w-full h-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}