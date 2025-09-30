import { createMockLogger, withEnvironment } from './testing';

describe('shared testing utilities', () => {
  it('captures logs emitted through the mock logger', () => {
    const { logger, logs } = createMockLogger();
    logger.log('hello');
    logger.error('world');
    expect(logs).toEqual(['log hello', 'error world']);
  });

  it('restores environment variables after execution', async () => {
    process.env['TEST_ENV_RESET'] = 'initial';
    await withEnvironment({ TEST_ENV_RESET: 'changed' }, async () => {
      expect(process.env['TEST_ENV_RESET']).toBe('changed');
    });
    expect(process.env['TEST_ENV_RESET']).toBe('initial');
    delete process.env['TEST_ENV_RESET'];
  });
});
