import { buildApiUrl, mapMongoDocument } from './core-utils';

describe('core utils', () => {
  it('maps mongo documents to include string id', () => {
    const mapped = mapMongoDocument({
      _id: { toString: () => '123' },
      title: 'Nebula Dreams',
    });

    expect(mapped).toEqual({ id: '123', title: 'Nebula Dreams' });
  });

  it('builds api urls without double slashes', () => {
    expect(buildApiUrl('http://localhost:3333/api', 'catalog/featured')).toBe(
      'http://localhost:3333/api/catalog/featured'
    );
    expect(buildApiUrl(undefined, '/catalog/featured')).toBe(
      '/catalog/featured'
    );
  });
});
