import { Injectable, Logger } from '@nestjs/common';
import { createDomainError, isDomainError } from '@helena-art-store/core/utils';
import { defaultFeaturedArt, FeaturedArtResponse } from '@helena-art-store/api-types';
import { ArtPieceRepository } from './catalog.repository';
import { toFeaturedResponse } from './catalog.utils';

@Injectable()
export class CatalogService {
  constructor(private readonly repository: ArtPieceRepository, private readonly logger: Logger) {}

  async getFeaturedCollection(limit = 4): Promise<FeaturedArtResponse> {
    const safeLimit = Math.min(Math.max(limit, 2), 12);

    try {
      const documents = await this.repository.findFeatured(safeLimit);
      return toFeaturedResponse(documents as never, safeLimit);
    } catch (error) {
      if (isDomainError(error) && error.statusCode === 503) {
        this.logger.warn('Serving curated featured set because MongoDB is unavailable.');
        return defaultFeaturedArt;
      }

      throw createDomainError('CATALOG_SERVICE_FAILURE', 'Unable to retrieve featured artwork.', 503, error);
    }
  }
}
