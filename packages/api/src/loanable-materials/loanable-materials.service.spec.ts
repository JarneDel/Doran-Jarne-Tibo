import { Test, TestingModule } from '@nestjs/testing';
import { LoanableMaterialsService } from './loanable-materials.service';

describe('LoanableMaterialsService', () => {
  let service: LoanableMaterialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanableMaterialsService],
    }).compile();

    service = module.get<LoanableMaterialsService>(LoanableMaterialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
