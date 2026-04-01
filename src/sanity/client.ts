import { createClient } from 'next-sanity';
import { mockSongs } from './mockData';

export const getClient = () => {
  if (!process.env.SANITY_PROJECT_ID) {
    return null;
  }
  return createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  });
};

export async function fetchSongBySlug(slug: string) {
  const client = getClient();
  if (!client) {
    // Return mock data if no Sanity client
    return mockSongs.find(song => song.slug === slug) || null;
  }
  
  // Real GROQ query when Sanity is connected
  return client.fetch(
    `*[_type == "song" && slug.current == $slug][0]{
      "slug": slug.current,
      title,
      description,
      "vocaloidName": vocaloid->name,
      "vocaloidSlug": vocaloid->slug.current,
      audioUrl,
      embedUrl,
      "coverImage": coverImage.asset->url,
      releaseDate,
      duration,
      tags
    }`,
    { slug }
  );
}
export async function fetchRelatedSongs(vocaloidSlug: string, currentSlug: string) {
  const client = getClient();
  if (!client) {
    return mockSongs.filter(s => s.vocaloidSlug === vocaloidSlug && s.slug !== currentSlug).slice(0, 3);
  }

  return client.fetch(
    `*[_type == "song" && vocaloid->slug.current == $vocaloidSlug && slug.current != $currentSlug][0...3]{
      "slug": slug.current,
      title,
      description,
      duration,
      bpm,
      "coverImage": coverImage.asset->url
    }`,
    { vocaloidSlug, currentSlug }
  );
}