import { type Artwork } from '@helena-art-store/api-types';

export function createArtworkFixture(
  overrides: Partial<Artwork> = {}
): Artwork {
  return {
    id: 'art-fixture',
    title: 'Fixture Title',
    artist: 'Fixture Artist',
    price: 1000,
    imageUrl: 'https://example.com/artwork.jpg',
    description: 'Fixture description for testing.',
    tags: ['fixture'],
    available: true,
    ...overrides,
  };
}
