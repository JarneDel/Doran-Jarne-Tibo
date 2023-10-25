import { Test, TestingModule } from '@nestjs/testing';
import { RepairRequestResolver } from './repair-request.resolver';
import { RepairRequestService } from './repair-request.service';

describe('RepairRequestResolver', () => {
  let resolver: RepairRequestResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepairRequestResolver, RepairRequestService],
    }).compile();

    resolver = module.get<RepairRequestResolver>(RepairRequestResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
