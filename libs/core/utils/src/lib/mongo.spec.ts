import { mapMany, toPlainObject } from './mongo';

describe('mongo utils', () => {
  it('normalises mongoose documents', () => {
    const input = {
      _id: { toString: () => '507f191e810c19729de860ea' },
      __v: 0,
      title: 'Test',
    };

    const result = toPlainObject(input);
    expect(result.id).toBe('507f191e810c19729de860ea');
    expect(result).not.toHaveProperty('_id');
    expect(result).not.toHaveProperty('__v');
  });

  it('maps collections', () => {
    const docs = [
      { _id: 'a', name: 'one' },
      { _id: 'b', name: 'two' },
    ];

    expect(mapMany(docs)).toEqual([
      { id: 'a', name: 'one' },
      { id: 'b', name: 'two' },
    ]);
  });
});
