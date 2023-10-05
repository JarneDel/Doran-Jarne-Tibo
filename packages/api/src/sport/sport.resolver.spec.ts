import { Test, TestingModule } from '@nestjs/testing';
import { SportResolver } from './sport.resolver';
import { SportService } from './sport.service';

describe('SportResolver', () => {
  let resolver: SportResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportResolver, SportService],
    }).compile();

    resolver = module.get<SportResolver>(SportResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
