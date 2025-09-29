import { Controller, Get } from '@nestjs/common';
import { FeaturedArtworksResponseDto } from './catalog.dto';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('featured')
  getFeaturedArtworks(): Promise<FeaturedArtworksResponseDto> {
    return this.catalogService.getFeaturedArtworks();
  }
}
