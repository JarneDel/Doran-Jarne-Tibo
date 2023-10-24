// Typeorm
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
// testing
import { Test, TestingModule } from '@nestjs/testing'
// Services
import { RepairRequestService } from './repair-request.service'
// Entities
import { RepairRequest } from './entities/repair-request.entity'
// Stubs
import { repairRequestStub } from './stubs/repair-request.stub'
import { createRepairRequestInputStub } from './stubs/repair-request.stub'

describe('RepairRequestService', () => {
  let service: RepairRequestService
  let mockRepository: Repository<RepairRequest>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepairRequestService,
        {
          provide: getRepositoryToken(RepairRequest),
          useValue: {
            save: jest.fn().mockResolvedValue(repairRequestStub()),
            find: jest.fn().mockResolvedValue([repairRequestStub()]),
            findOneByOrFail: jest.fn().mockResolvedValue(repairRequestStub()),
          },
        },
      ],
    }).compile()

    service = module.get<RepairRequestService>(RepairRequestService)
    mockRepository = module.get<Repository<RepairRequest>>(
      getRepositoryToken(RepairRequest)
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // Test create
  describe('create()', () => {
    describe('when create is called', () => {
      it('should call repairRequest.save() exactly once', async () => {
        const repairRequest = new RepairRequest()
        const saveSpy = jest.spyOn(mockRepository, 'save')

        await service.create(repairRequest)
        expect(saveSpy).toBeCalledTimes(1)
      })
      it('should return a repairRequest', async () => {
        const repairRequest = await service.create(
          createRepairRequestInputStub()
        )
        expect(repairRequest).toEqual(repairRequestStub())
      })
    })
  })

  // Test findAll
  describe('findAll()', () => {
    describe('when findAll is called', () => {
      it('should call repairRequest.find() and return all repairRequests', async () => {
        const repairRequests = [repairRequestStub()]
        const findSpy = jest.spyOn(mockRepository, 'find')

        const result = await service.findAll()
        expect(findSpy).toBeCalledTimes(1)
        expect(result).toEqual(repairRequests)
      })
    })
  })

  // Test findOneById
  describe('findOneById()', () => {
    describe('when findOneById is called', () => {
      it('should call repairRequest.findOne() and return a repairRequest', async () => {
        const repairRequest = repairRequestStub()
        const findOneSpy = jest
          .spyOn(mockRepository, 'findOneByOrFail')
          .mockResolvedValue(repairRequest)

        const result = await service.findOneById('6536630b07fc7efb0be2114a')
        expect(findOneSpy).toBeCalledTimes(1)
        expect(result).toEqual(repairRequest)
      })
    })
  })

  // Test update
  describe('update()', () => {
    describe('when update is called', () => {
      it('should call repairRequest.save() and return a repairRequest', async () => {
        const repairRequest = repairRequestStub()
        const saveSpy = jest.spyOn(mockRepository, 'save')

        const result = await service.update(
          '6536630b07fc7efb0be2114a',
          repairRequest
        )
        expect(saveSpy).toBeCalledTimes(1)
        expect(result).toEqual(repairRequest)
      })
    })
  })
})
