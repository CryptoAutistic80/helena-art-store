import type { Document } from 'mongoose';

export interface WithOptionalMongoId {
  _id?: unknown;
  id?: unknown;
}

/**
 * Maps a Mongo document (lean or hydrated) to a plain object with an `id` field.
 */
export function mapMongoDocument<T extends WithOptionalMongoId>(
  document: T
): Omit<T, '_id'> & { id: string } {
  const value = document as T & { _id?: unknown };
  const idValue =
    typeof value._id === 'object' && value._id !== null && 'toString' in value._id
      ? (value._id as { toString: () => string }).toString()
      : String(value._id ?? value.id ?? '');

  const { _id, ...rest } = value;
  return {
    ...(rest as Omit<T, '_id'>),
    id: idValue,
  };
}

export function toPlainLean<T>(input: T | (T & Document)): T {
  if (typeof (input as Document).toJSON === 'function') {
    return ((input as Document).toJSON() as T) ?? (input as T);
  }

  return input as T;
}

export function buildApiUrl(baseUrl: string | undefined, path: string): string {
  const normalizedBase = baseUrl?.replace(/\/$/, '') ?? '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}` || normalizedPath;
}
