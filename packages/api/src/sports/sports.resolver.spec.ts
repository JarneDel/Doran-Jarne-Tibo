import { Test, TestingModule } from '@nestjs/testing';
import { SportsResolver } from './sports.resolver';
import { SportsService } from './sports.service';

describe('SportsResolver', () => {
  let resolver: SportsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportsResolver, SportsService],
    }).compile();

    resolver = module.get<SportsResolver>(SportsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
