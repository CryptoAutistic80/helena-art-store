import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '@helena-art-store/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService<AppConfig, true>) {}

  getRootMessage() {
    return {
      name: 'Helena Art Store API',
      version: 'v1',
      environment: this.config.get('nodeEnv', { infer: true }),
      documentation: 'https://github.com/helena-art-store/docs',
    };
  }
}
