import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtPieceRepository } from './catalog.repository';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ArtPieceDocument, ArtPieceSchema } from './catalog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ArtPieceDocument.name,
        schema: ArtPieceSchema,
      },
    ]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService, ArtPieceRepository, Logger],
  exports: [CatalogService],
})
export class CatalogModule {}
