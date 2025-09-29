import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  MONGODB_URI: z.string().url().optional(),
  FRONTEND_ORIGIN: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const defaultConfig = (env: Env) => ({
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  mongoUri: env.MONGODB_URI ?? 'mongodb://localhost:27017/helena-art-store',
  frontendOrigin: env.FRONTEND_ORIGIN ?? 'http://localhost:4200',
});

export function validateEnv(config: Record<string, unknown>): Env {
  return envSchema.parse(config);
}
