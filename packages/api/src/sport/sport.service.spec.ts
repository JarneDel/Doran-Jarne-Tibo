import { Test, TestingModule } from '@nestjs/testing'
import { SportService } from './sport.service'
import { Repository } from 'typeorm'
import { Sport } from './entities/sport.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { sportStub } from './stubs/sport.stub'

describe('SportService', () => {
  let service: SportService
  let mockRepository: Repository<Sport>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportService,
        {
          provide: getRepositoryToken(Sport),
          useValue: {
            save: jest.fn().mockResolvedValue(sportStub()),
            find: jest.fn().mockResolvedValue([sportStub()]),
            findOneByOrFail: jest.fn().mockResolvedValue(sportStub()),
            findOne: jest.fn().mockResolvedValue(sportStub()),
            delete: jest.fn().mockResolvedValue({
              raw: { acknowledged: true, deletedCount: 1 },
              affected: 1,
            }),
          },
        },
      ],
    }).compile()

    service = module.get<SportService>(SportService)
    mockRepository = module.get<Repository<Sport>>(getRepositoryToken(Sport))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a sport', async () => {
      const result = await service.create(sportStub())
      expect(result).toEqual(sportStub())
    })
  })

  describe('findAll', () => {
    it('should return an array of sports', async () => {
      const result = await service.findAll()
      expect(result).toEqual([sportStub()])
    })

    it('should return an empty array', async () => {
      mockRepository.find = jest.fn().mockResolvedValue([])
      const result = await service.findAll()
      expect(result).toEqual([])
    })
  })

  describe('findOneById', () => {
    it('should return a sport', async () => {
      const result = await service.findOneById('656a1085a90f2e4962ae915a')
      expect(result).toEqual(sportStub())
    })
  })

  describe('findOneByName', () => {
    it('should return a sport', async () => {
      const result = await service.findOneByName('sport')
      expect(result).toEqual(sportStub())
    })
  })

  describe('update', () => {
    it('should update a sport', async () => {
      const result = await service.update(
        '656a1085a90f2e4962ae915a',
        sportStub(),
      )
      expect(result).toEqual(sportStub())
    })
  })

  describe('remove', () => {
    it('should delete a sport', async () => {
      const result = await service.remove('656a1085a90f2e4962ae915a')
      expect(result).toEqual({
        raw: { acknowledged: true, deletedCount: 1 },
        affected: 1,
      })
    })
  })
})
