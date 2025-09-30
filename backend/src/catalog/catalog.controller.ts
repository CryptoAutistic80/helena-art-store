import { Controller, Get, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { GetFeaturedArtQueryDto } from './catalog.dto';

@Controller({ path: 'catalog', version: '1' })
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('featured')
  getFeatured(@Query() query: GetFeaturedArtQueryDto) {
    return this.catalogService.getFeaturedCollection(query.limit);
  }
}
