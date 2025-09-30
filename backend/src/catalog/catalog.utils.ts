import type { FeaturedArtResponse } from '@helena-art-store/api-types';
import { defaultFeaturedArt } from '@helena-art-store/api-types';
import { mapMany } from '@helena-art-store/core/utils';

export const toFeaturedResponse = (
  documents: Array<Record<string, unknown>>,
  minimum = 4,
): FeaturedArtResponse => {
  const mapped = mapMany(documents as Array<Record<string, unknown> & { _id: unknown }>);
  if (!mapped.length) {
    return defaultFeaturedArt;
  }

  const filled = mapped.length >= minimum ? mapped : [...mapped, ...defaultFeaturedArt.spotlight].slice(0, minimum);
  const [hero, ...spotlight] = filled;
  return {
    hero: hero ?? defaultFeaturedArt.hero,
    spotlight: spotlight.length ? spotlight : defaultFeaturedArt.spotlight,
  };
};
