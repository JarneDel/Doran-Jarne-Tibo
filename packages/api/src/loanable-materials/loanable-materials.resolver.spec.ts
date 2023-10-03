import { Test, TestingModule } from '@nestjs/testing';
import { LoanableMaterialsResolver } from './loanable-materials.resolver';
import { LoanableMaterialsService } from './loanable-materials.service';

describe('LoanableMaterialsResolver', () => {
  let resolver: LoanableMaterialsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanableMaterialsResolver, LoanableMaterialsService],
    }).compile();

    resolver = module.get<LoanableMaterialsResolver>(LoanableMaterialsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
