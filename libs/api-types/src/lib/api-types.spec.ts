import { defaultFeaturedArt, featuredArtResponseSchema } from './api-types';

describe('api-types', () => {
  it('validates the default featured collection', () => {
    const parsed = featuredArtResponseSchema.safeParse(defaultFeaturedArt);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.spotlight).toHaveLength(3);
    }
  });
});
