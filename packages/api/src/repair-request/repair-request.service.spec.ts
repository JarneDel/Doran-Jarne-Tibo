import { Test, TestingModule } from '@nestjs/testing'
import { RepairRequestService } from './repair-request.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RepairRequest } from './entities/repair-request.entity'
import { Repository } from 'typeorm'
import { repairRequestStub } from './stubs/repair-request.stub'

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

  describe('create()', () => {
    describe('when create is called', () => {
      it('should call repairRequest.save()', async () => {
        const repairRequest = new RepairRequest()
        const saveSpy = jest.spyOn(mockRepository, 'save')

        await service.create(repairRequest)
        expect(saveSpy).toBeCalledTimes(1)
      })
    })
  })
})
