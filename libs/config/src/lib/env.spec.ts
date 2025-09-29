import { defaultConfig, validateEnv } from './env';

describe('env config', () => {
  it('parses and normalises environment variables', () => {
    const env = validateEnv({
      NODE_ENV: 'production',
      PORT: '4200',
      MONGODB_URI: 'mongodb://localhost:27017/helena',
      FRONTEND_ORIGIN: 'https://helena.art',
    });

    expect(defaultConfig(env)).toEqual({
      nodeEnv: 'production',
      port: 4200,
      mongoUri: 'mongodb://localhost:27017/helena',
      frontendOrigin: 'https://helena.art',
    });
  });
});
