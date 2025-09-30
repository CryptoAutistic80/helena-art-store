import type { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';

export const createTestingModule = async (metadata: ModuleMetadata): Promise<TestingModule> =>
  Test.createTestingModule(metadata).compile();

export const createMockLogger = () => {
  const logs: string[] = [];
  return {
    logs,
    logger: {
      debug: (...args: unknown[]) => logs.push(['debug', ...args].join(' ')),
      log: (...args: unknown[]) => logs.push(['log', ...args].join(' ')),
      warn: (...args: unknown[]) => logs.push(['warn', ...args].join(' ')),
      error: (...args: unknown[]) => logs.push(['error', ...args].join(' ')),
    },
  } as const;
};

export const withEnvironment = (values: Record<string, string>, callback: () => void | Promise<void>) => {
  const originals = Object.keys(values).reduce<Record<string, string | undefined>>((acc, key) => {
    acc[key] = process.env[key];
    process.env[key] = values[key];
    return acc;
  }, {});

  const restore = () => {
    Object.entries(originals).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  };

  const result = callback();
  if (result instanceof Promise) {
    return result.finally(restore);
  }
  restore();
  return result;
};
