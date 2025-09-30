import { createDomainError, isDomainError } from './domain-error';

describe('domain-error', () => {
  it('creates typed domain errors', () => {
    const error = createDomainError('CATALOG_NOT_FOUND', 'Catalog entry was not found', 404);
    expect(isDomainError(error)).toBe(true);
    expect(error.code).toBe('CATALOG_NOT_FOUND');
    expect(error.statusCode).toBe(404);
  });
});
