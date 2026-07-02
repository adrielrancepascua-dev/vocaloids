"use client";

import { YouTubeEmbed } from '../../../components/YouTubeEmbed';

type Props = {
  embedUrl: string;
  title: string;
  slug: string;
};

export function SongClientEmbed({ embedUrl, title, slug }: Props) {
  return (
    <div className="mt-8 border-t border-white/10 pt-8 flex flex-col gap-4">
      <h3 className="text-sm uppercase tracking-widest text-zinc-500">Official Video Record</h3>
      
      <YouTubeEmbed 
        url={embedUrl}
        title={title}
      />
    </div>
  );
}
