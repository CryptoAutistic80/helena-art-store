import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ArtworkRepository } from './catalog.repository';
import { ArtworkEntity, ArtworkSchema } from './catalog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ArtworkEntity.name,
        schema: ArtworkSchema,
      },
    ]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService, ArtworkRepository],
  exports: [CatalogService],
})
export class CatalogModule {}
