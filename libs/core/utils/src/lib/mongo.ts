import type { HydratedDocument } from 'mongoose';

interface WithDocumentId {
  _id: unknown;
  id?: never;
  __v?: unknown;
}

type MongoEntity<T> = (T & WithDocumentId) | HydratedDocument<T & WithDocumentId>;

type Sanitised<T> = T & { id: string };

export const toPlainObject = <T extends Record<string, unknown>>(input: MongoEntity<T> | (T & WithDocumentId)): Sanitised<T> => {
  const document = typeof input.toJSON === 'function' ? input.toJSON({ virtuals: true }) : input;
  const { _id, __v: versionKey, ...rest } = document as Record<string, unknown>;
  void versionKey;
  return {
    ...(rest as T),
    id: String((_id as { toString: () => string })?.toString?.() ?? _id),
  };
};

export const mapMany = <T extends Record<string, unknown>>(items: Array<MongoEntity<T> | (T & WithDocumentId)>): Sanitised<T>[] =>
  items.map((item) => toPlainObject<T>(item));
