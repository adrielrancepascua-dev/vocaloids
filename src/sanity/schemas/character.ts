export default {
  name: 'character',
  title: 'Character',
  type: 'document',
  fields: [
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'origin', title: 'Origin', type: 'string' },
    {
      name: 'topSongs',
      title: 'Top Songs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'slug', type: 'string' },
            { name: 'duration', type: 'string' }
          ]
        }
      ]
    },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }
  ]
}
