import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { defaultConfig, validateEnv, type Env } from '@helena-art-store/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env>) => {
        const env = validateEnv({
          NODE_ENV: config.get('NODE_ENV'),
          PORT: config.get('PORT'),
          MONGODB_URI: config.get('MONGODB_URI'),
          FRONTEND_ORIGIN: config.get('FRONTEND_ORIGIN'),
        });
        const resolved = defaultConfig(env);

        return {
          uri: resolved.mongoUri,
        };
      },
    }),
    CatalogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
