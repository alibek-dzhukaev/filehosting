import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../src/database/database.service';
import { ConfigService } from '@nestjs/config';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'database.host') return 'test_host';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should return test_host for database host', () => {
    expect(service.getDatabaseConfig().host).toBe('test_host');
  });
});