import { useQuery } from '@tanstack/react-query';
import type { FeaturedArtResponse } from '@helena-art-store/api-types';
import { defaultFeaturedArt } from '@helena-art-store/api-types';
import { request } from '../../../app/api/httpClient';

const FEATURED_ART_QUERY_KEY = ['gallery', 'featured'];

const fetchFeaturedArt = async (): Promise<FeaturedArtResponse> => {
  try {
    return await request<FeaturedArtResponse>('/v1/catalog/featured');
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Falling back to curated featured art set:', error);
    }
    return defaultFeaturedArt;
  }
};

export const useFeaturedArtQuery = () =>
  useQuery({
    queryKey: FEATURED_ART_QUERY_KEY,
    queryFn: fetchFeaturedArt,
    initialData: defaultFeaturedArt,
  });
