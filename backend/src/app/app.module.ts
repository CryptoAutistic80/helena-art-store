import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createConfigModuleOptions, AppConfig } from '@helena-art-store/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from '../catalog/catalog.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot(createConfigModuleOptions()),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<AppConfig, true>) => {
        const mongodb = config.get('mongodb', { infer: true });
        return {
          uri: mongodb?.uri ?? 'mongodb://127.0.0.1:27017/helena-art-store',
          dbName: mongodb?.dbName ?? 'helena-art-store',
          autoIndex: true,
          serverSelectionTimeoutMS: 1000,
          connectTimeoutMS: 1000,
        };
      },
    }),
    CatalogModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
