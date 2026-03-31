export default {
  name: 'song',
  title: 'Song',
  type: 'document',
  fields: [
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'vocaloid', title: 'Vocaloid', type: 'reference', to: [{ type: 'character' }] },
    { name: 'audioUrl', title: 'Audio URL', type: 'url' },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'releaseDate', title: 'Release Date', type: 'date' },
    { name: 'duration', title: 'Duration', type: 'string' },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }
  ]
}
