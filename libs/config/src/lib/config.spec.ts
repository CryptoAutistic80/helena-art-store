import { buildConfig, envSchema } from './config';

describe('config', () => {
  afterEach(() => {
    delete process.env['PORT'];
  });

  it('hydrates defaults from env', () => {
    const parsed = envSchema.parse({});
    expect(parsed.PORT).toBe(3000);
  });

  it('produces structured config', async () => {
    process.env['PORT'] = '4000';
    const configResult = buildConfig();
    const config = configResult instanceof Promise ? await configResult : configResult;
    expect(config.http.port).toBe(4000);
  });
});
