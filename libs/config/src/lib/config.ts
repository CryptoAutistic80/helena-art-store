import type { ConfigFactory, ConfigModuleOptions } from '@nestjs/config';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().url().optional(),
  MONGODB_DB_NAME: z.string().optional(),
  FRONTEND_URL: z.string().url().optional(),
  API_RATE_LIMIT_TTL: z.coerce.number().int().positive().default(60),
  API_RATE_LIMIT: z.coerce.number().int().positive().default(120),
});

export type AppEnvironment = z.infer<typeof envSchema>;

export interface AppConfig {
  nodeEnv: AppEnvironment['NODE_ENV'];
  http: {
    port: number;
  };
  mongodb: {
    uri?: string;
    dbName?: string;
  };
  frontend: {
    url?: string;
  };
  security: {
    rateLimit: {
      ttl: number;
      limit: number;
    };
  };
}

export const validateEnvironment = (env: NodeJS.ProcessEnv): AppEnvironment => envSchema.parse(env);

export const buildConfig: ConfigFactory<AppConfig> = () => {
  const parsed = validateEnvironment(process.env);

  return {
    nodeEnv: parsed.NODE_ENV,
    http: {
      port: parsed.PORT,
    },
    mongodb: {
      uri: parsed.MONGODB_URI,
      dbName: parsed.MONGODB_DB_NAME,
    },
    frontend: {
      url: parsed.FRONTEND_URL,
    },
    security: {
      rateLimit: {
        ttl: parsed.API_RATE_LIMIT_TTL,
        limit: parsed.API_RATE_LIMIT,
      },
    },
  };
};

export const createConfigModuleOptions = (): ConfigModuleOptions => ({
  isGlobal: true,
  cache: true,
  load: [buildConfig],
  validate: (config: Record<string, unknown>) => envSchema.parse(config),
});
