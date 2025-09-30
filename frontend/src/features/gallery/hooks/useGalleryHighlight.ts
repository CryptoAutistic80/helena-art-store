import { useMemo } from 'react';
import { defaultFeaturedArt } from '@helena-art-store/api-types';
import { useFeaturedArtQuery } from '../api/galleryApi';

export const useGalleryHighlight = () => {
  const { data, isLoading } = useFeaturedArtQuery();

  const hero = data?.hero ?? defaultFeaturedArt.hero;
  const spotlight = data?.spotlight ?? defaultFeaturedArt.spotlight;

  const metrics = useMemo(
    () => [
      { label: 'Collectors worldwide', value: '4.8k' },
      { label: 'Interactive commissions', value: '120+' },
      { label: 'Avg. satisfaction score', value: '4.9/5' },
    ],
    [],
  );

  return { hero, spotlight, metrics, isLoading };
};
