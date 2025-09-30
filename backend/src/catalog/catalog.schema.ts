import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'art_pieces',
  timestamps: true,
})
export class ArtPieceDocument {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  artist!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true })
  imageUrl!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ default: true })
  available!: boolean;

  @Prop({ type: Object })
  dimensions?: {
    widthCm: number;
    heightCm: number;
    depthCm?: number;
  };

  @Prop({ default: false })
  isFeatured!: boolean;

  @Prop({ default: 0 })
  featuredOrder!: number;
}

export const ArtPieceSchema = SchemaFactory.createForClass(ArtPieceDocument);

ArtPieceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (
    _doc: unknown,
    ret: Record<string, unknown> & { _id?: { toString: () => string } | string; id?: string },
  ) => {
    ret.id = typeof ret._id === 'string' ? ret._id : ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

ArtPieceSchema.index({ isFeatured: 1, featuredOrder: 1 });

export type ArtPieceEntity = HydratedDocument<ArtPieceDocument>;
