import { Injectable } from '@nestjs/common';
import { ArtworkDto, FeaturedArtworksResponseDto } from './catalog.dto';
import { ArtworkRepository } from './catalog.repository';

@Injectable()
export class CatalogService {
  constructor(private readonly artworkRepository: ArtworkRepository) {}

  async getFeaturedArtworks(): Promise<FeaturedArtworksResponseDto> {
    const artworks = await this.artworkRepository.findFeaturedArtworks();
    return {
      artworks: artworks.map((item) => Object.assign(new ArtworkDto(), item)),
    };
  }
}
