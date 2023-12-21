import { Test, TestingModule } from '@nestjs/testing';
import { LoanableMaterialsService } from './loanable-materials.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { loanableMaterialStub, updateLoanableMaterialInputStub } from './stubs/loanable-materials.stub'
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
            findOne: jest.fn().mockResolvedValue(loanableMaterialStub()),
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

  describe('create', () => {
    it('should create a loanable material', async () => {
      const result = await service.create(loanableMaterialStub())
      expect(result).toEqual(loanableMaterialStub())
    })
  })

  describe('findAll', () => {
    it('should return an array of loanable materials', async () => {
      const result = await service.findAll()
      expect(result).toEqual([loanableMaterialStub()])
    })

    it('should return an empty array', async () => {
      mockRepository.find = jest.fn().mockResolvedValue([])
      const result = await service.findAll()
      expect(result).toEqual([])
    })
  })

  describe('findOneById', () => {
    it('should return a loanable material', async () => {
      const result = await service.findOneById('656a1085a90f2e4962ae915a')
      expect(result).toEqual(loanableMaterialStub())
    })
  })

  describe('update', () => {
    it('should update a loanable material', async () => {
      const result = await service.update(
        '656a1085a90f2e4962ae915a',
        updateLoanableMaterialInputStub(),
      )
      expect(result).toEqual(loanableMaterialStub())
    })

    it('should throw an error when loanable material not found', async () => {
      mockRepository.findOne = jest.fn().mockResolvedValue(undefined)
      await expect(
        service.update(
          '656a1085a90f2e4962ae915a',
          updateLoanableMaterialInputStub(),
        ),
      ).rejects.toThrow()
    })
  })

});

