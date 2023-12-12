import { Test, TestingModule } from '@nestjs/testing';
import { LoanableMaterialsService } from './loanable-materials.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { loanableMaterialStub } from './stubs/loanable-materials.stub'
import { LoanableMaterial } from './entities/loanable-material.entity';

describe('LoanableMaterialsService', () => {
  let service: LoanableMaterialsService;
  let mockRepository: Repository<LoanableMaterial>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanableMaterialsService,
        {
          provide: getRepositoryToken(LoanableMaterial),
          useValue: {
            save: jest.fn().mockResolvedValue(loanableMaterialStub()),
            find: jest.fn().mockResolvedValue([loanableMaterialStub()]),
            findOneByOrFail: jest
              .fn()
              .mockResolvedValue(loanableMaterialStub()),
          },
        },
      ],
    }).compile()

    service = module.get<LoanableMaterialsService>(LoanableMaterialsService);
    mockRepository = module.get<Repository<LoanableMaterial>>(
      getRepositoryToken(LoanableMaterial)
    )
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

