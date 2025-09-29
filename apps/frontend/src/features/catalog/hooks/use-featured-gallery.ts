import { useMemo } from 'react';
import { useFeaturedArtworks } from '../api/use-featured-artworks';

export function useFeaturedGallery() {
  const { data, isLoading, isError } = useFeaturedArtworks();

  const artworks = useMemo(() => data?.artworks ?? [], [data]);

  return {
    artworks,
    isLoading,
    isError,
  };
}
