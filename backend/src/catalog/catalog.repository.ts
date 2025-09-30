import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createDomainError } from '@helena-art-store/core/utils';
import { ArtPieceDocument } from './catalog.schema';

@Injectable()
export class ArtPieceRepository {
  constructor(
    @InjectModel(ArtPieceDocument.name) private readonly artPieceModel: Model<ArtPieceDocument>,
    private readonly logger: Logger,
  ) {}

  async findFeatured(limit: number) {
    try {
      return await this.artPieceModel
        .find({ isFeatured: true })
        .sort({ featuredOrder: 1, updatedAt: -1 })
        .limit(limit)
        .lean({ virtuals: true });
    } catch (error) {
      this.logger.error('Failed to query featured art pieces', error as Error);
      throw createDomainError('CATALOG_REPOSITORY_UNAVAILABLE', 'Catalogue data is temporarily unavailable.', 503, error);
    }
  }
}
