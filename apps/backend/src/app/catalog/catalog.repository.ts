import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { mapMongoDocument, toPlainLean } from '@helena-art-store/core/utils';
import type { Artwork } from '@helena-art-store/api-types';
import type { Model } from 'mongoose';
import { ArtworkEntity, type ArtworkDocument } from './catalog.schema';

const FEATURED_ARTWORK_STUBS: Artwork[] = [
  {
    id: 'helena-nebula-dreams',
    title: 'Nebula Dreams',
    artist: 'Helena Nova',
    price: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    tags: ['digital', 'space', 'limited'],
    description:
      'Volumetric cosmic clouds rendered with ray-marched neon lighting and depth.',
    available: true,
  },
  {
    id: 'helena-chromatic-bloom',
    title: 'Chromatic Bloom',
    artist: 'Helena Nova',
    price: 890,
    imageUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6',
    tags: ['flora', 'sculpted light'],
    description:
      'Generative floral sculpture suspended in translucent glass with caustics.',
    available: false,
  },
  {
    id: 'helena-spectral-wave',
    title: 'Spectral Wave',
    artist: 'Helena Nova',
    price: 1430,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    tags: ['motion', 'sound'],
    description:
      'Audio-reactive ribbon capturing the resonance of a midnight ocean swell.',
    available: true,
  },
];

@Injectable()
export class ArtworkRepository {
  private readonly logger = new Logger(ArtworkRepository.name);

  constructor(
    @InjectModel(ArtworkEntity.name)
    private readonly artworkModel: Model<ArtworkDocument>
  ) {}

  async findFeaturedArtworks(): Promise<Artwork[]> {
    try {
      const results = await this.artworkModel
        .find({ featured: true })
        .sort({ updatedAt: -1 })
        .lean()
        .exec();

      if (results.length > 0) {
        return results.map((item) => mapMongoDocument(toPlainLean(item)));
      }

      return FEATURED_ARTWORK_STUBS;
    } catch (error) {
      this.logger.warn(
        `Falling back to stubbed featured artworks due to database error: ${(error as Error).message}`
      );
      return FEATURED_ARTWORK_STUBS;
    }
  }
}
