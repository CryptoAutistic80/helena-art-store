import { z } from 'zod';

export const artPieceSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  description: z.string(),
  price: z.number().nonnegative(),
  imageUrl: z.string().url(),
  tags: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  dimensions: z
    .object({
      widthCm: z.number().nonnegative(),
      heightCm: z.number().nonnegative(),
      depthCm: z.number().nonnegative().optional(),
    })
    .optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ArtPiece = z.infer<typeof artPieceSchema>;

export const featuredArtResponseSchema = z.object({
  hero: artPieceSchema,
  spotlight: z.array(artPieceSchema).min(1),
});

export type FeaturedArtResponse = z.infer<typeof featuredArtResponseSchema>;

export const galleryHighlightSchema = z.object({
  headline: z.string(),
  subheading: z.string(),
  featured: featuredArtResponseSchema,
});

export type GalleryHighlight = z.infer<typeof galleryHighlightSchema>;

export const galleryInquiryPayloadSchema = z.object({
  artId: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export type GalleryInquiryPayload = z.infer<typeof galleryInquiryPayloadSchema>;

export const defaultFeaturedArt = featuredArtResponseSchema.parse({
  hero: {
    id: 'demo-luminescence',
    title: 'Luminescence in Motion',
    artist: 'Helena Mora',
    description:
      'A mesmerizing kinetic canvas blending fluid particle motion with prismatic color, rendered live in WebGL.',
    price: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
    tags: ['immersive', 'interactive', 'webgl'],
    available: true,
    dimensions: {
      widthCm: 120,
      heightCm: 90,
    },
    createdAt: new Date('2024-04-11T10:00:00.000Z').toISOString(),
    updatedAt: new Date('2024-09-20T09:15:00.000Z').toISOString(),
  },
  spotlight: [
    {
      id: 'demo-spectral-symphony',
      title: 'Spectral Symphony',
      artist: 'Jules Kei',
      description:
        'A responsive aurora that harmonises viewer gestures with ambient sound through shader compositions.',
      price: 2800,
      imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1600&q=80',
      tags: ['audio-reactive', 'shader-art'],
      available: true,
      dimensions: {
        widthCm: 100,
        heightCm: 100,
        depthCm: 5,
      },
      createdAt: new Date('2024-05-01T14:00:00.000Z').toISOString(),
      updatedAt: new Date('2024-09-02T16:32:00.000Z').toISOString(),
    },
    {
      id: 'demo-chromatic-drift',
      title: 'Chromatic Drift',
      artist: 'Noemi Voss',
      description:
        'Generative textile patterns inspired by ocean currents, woven in real time from curated data streams.',
      price: 3600,
      imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
      tags: ['generative', 'textile'],
      available: false,
      dimensions: {
        widthCm: 140,
        heightCm: 60,
      },
      createdAt: new Date('2024-02-18T12:00:00.000Z').toISOString(),
      updatedAt: new Date('2024-08-12T11:12:00.000Z').toISOString(),
    },
    {
      id: 'demo-nebulae',
      title: 'Nebulae of Memory',
      artist: 'Helena Mora',
      description:
        'Layered volumetric clouds that capture audience emotion through real-time sentiment visualisation.',
      price: 5100,
      imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
      tags: ['volumetric', 'installation'],
      available: true,
      dimensions: {
        widthCm: 200,
        heightCm: 120,
        depthCm: 40,
      },
      createdAt: new Date('2024-01-07T18:22:00.000Z').toISOString(),
      updatedAt: new Date('2024-09-05T08:03:00.000Z').toISOString(),
    },
  ],
});
