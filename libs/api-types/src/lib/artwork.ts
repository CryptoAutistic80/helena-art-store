import { z } from 'zod';

export const artworkSchema = z.object({
  id: z.string().min(1, 'Artwork id is required'),
  title: z.string().min(1, 'Artwork title is required'),
  artist: z.string().min(1, 'Artist name is required'),
  price: z.number().nonnegative('Price must be positive'),
  imageUrl: z.string().url('Artwork image must be a valid URL'),
  tags: z.array(z.string().min(1)).default([]),
  description: z.string().min(1, 'Artwork description is required'),
  available: z.boolean().default(true),
});

export type Artwork = z.infer<typeof artworkSchema>;

export const featuredArtworksResponseSchema = z.object({
  artworks: z.array(artworkSchema),
});

export type FeaturedArtworksResponse = z.infer<
  typeof featuredArtworksResponseSchema
>;
