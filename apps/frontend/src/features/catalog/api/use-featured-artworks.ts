import { useQuery } from '@tanstack/react-query';
import {
  featuredArtworksResponseSchema,
  type FeaturedArtworksResponse,
} from '@helena-art-store/api-types';
import { buildApiUrl } from '@helena-art-store/core/utils';

const FEATURED_ARTWORKS_QUERY_KEY = ['catalog', 'featured'];

async function fetchFeaturedArtworks(): Promise<FeaturedArtworksResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const response = await fetch(buildApiUrl(baseUrl, '/api/catalog/featured'));

  if (!response.ok) {
    throw new Error('Unable to load featured artworks');
  }

  const json = await response.json();
  return featuredArtworksResponseSchema.parse(json);
}

export function useFeaturedArtworks() {
  return useQuery({
    queryKey: FEATURED_ARTWORKS_QUERY_KEY,
    queryFn: fetchFeaturedArtworks,
    staleTime: 1000 * 60 * 5,
  });
}
