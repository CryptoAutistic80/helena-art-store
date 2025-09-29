import { createArtworkFixture } from './shared';

describe('shared testing fixtures', () => {
  it('allows overriding defaults', () => {
    const artwork = createArtworkFixture({ id: 'override', available: false });
    expect(artwork.id).toBe('override');
    expect(artwork.available).toBe(false);
  });
});
