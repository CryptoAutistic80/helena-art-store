import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { Artwork } from '@helena-art-store/api-types';

export class ArtworkDto implements Artwork {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsString()
  artist!: string;

  @IsNumber()
  price!: number;

  @IsString()
  imageUrl!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsString()
  description!: string;

  @IsBoolean()
  available!: boolean;
}

export class FeaturedArtworksResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArtworkDto)
  artworks!: ArtworkDto[];
}
