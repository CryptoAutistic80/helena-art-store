import { artworkSchema, featuredArtworksResponseSchema } from './artwork';

describe('artwork schema', () => {
  it('validates a well-formed artwork', () => {
    const result = artworkSchema.safeParse({
      id: 'art-1',
      title: 'Nebula Dreams',
      artist: 'Helena Nova',
      price: 1250,
      imageUrl: 'https://example.com/nebula.jpg',
      tags: ['digital', 'neon'],
      description: 'A luminous nebula rendered in volumetric detail.',
      available: true,
    });

    expect(result.success).toBe(true);
  });

  it('wraps artworks in a response payload', () => {
    const result = featuredArtworksResponseSchema.safeParse({
      artworks: [
        {
          id: 'art-2',
          title: 'Chromatic Bloom',
          artist: 'Helena Nova',
          price: 890,
          imageUrl: 'https://example.com/bloom.jpg',
          tags: ['floral'],
          description: 'Chromatic petals rendered with ray-marched lighting.',
          available: false,
        },
      ],
    });

    expect(result.success).toBe(true);
  });
});
