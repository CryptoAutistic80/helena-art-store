import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'artworks',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
})
export class ArtworkEntity {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  artist!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true })
  imageUrl!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ default: true })
  available!: boolean;

  @Prop({ required: true })
  description!: string;

  @Prop({ default: false, index: true })
  featured!: boolean;
}

export type ArtworkDocument = HydratedDocument<ArtworkEntity>;

export const ArtworkSchema = SchemaFactory.createForClass(ArtworkEntity);
