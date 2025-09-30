import { Logger } from '@nestjs/common';
import { defaultFeaturedArt } from '@helena-art-store/api-types';
import { createDomainError } from '@helena-art-store/core/utils';
import { CatalogService } from './catalog.service';

const createRepository = () => ({
  findFeatured: jest.fn(),
});

describe('CatalogService', () => {
  it('returns curated data when the repository fails', async () => {
    const repository = createRepository();
    repository.findFeatured.mockRejectedValueOnce(
      createDomainError('CATALOG_REPOSITORY_UNAVAILABLE', 'no db', 503),
    );

    const service = new CatalogService(repository as never, new Logger());
    await expect(service.getFeaturedCollection()).resolves.toEqual(defaultFeaturedArt);
  });
});
