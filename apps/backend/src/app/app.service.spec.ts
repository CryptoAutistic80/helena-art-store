import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  it('provides health metadata', () => {
    const result = service.health();
    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeDefined();
  });
});
