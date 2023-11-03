import { Test, TestingModule } from '@nestjs/testing';
import { VacationRequestResolver } from './vacation-request.resolver';
import { VacationRequestService } from './vacation-request.service';

describe('VacationRequestResolver', () => {
  let resolver: VacationRequestResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacationRequestResolver, VacationRequestService],
    }).compile();

    resolver = module.get<VacationRequestResolver>(VacationRequestResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
