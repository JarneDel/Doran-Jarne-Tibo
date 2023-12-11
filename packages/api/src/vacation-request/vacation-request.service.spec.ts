import { Test, TestingModule } from '@nestjs/testing'
import { VacationRequestService } from './vacation-request.service'
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils'
import { VacationRequest } from './entities/vacation-request.entity'
import { VacationRequestStub } from './stub/vacation-request.stub'
import { StaffService } from '../staff/staff.service'
import { ApproveVacationRequestInput } from './dto/approve-vacation-request.input'
import { MongoRepository } from 'typeorm'

describe('VacationRequestService', () => {
  let service: VacationRequestService
  let mockVacationRequestRepository: MongoRepository<VacationRequest>
  const mockedObjectId = '60d6c7f9f9c1a1492c4c2b1b'
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacationRequestService,
        {
          provide: getRepositoryToken(VacationRequest),
          useValue: {
            save: jest.fn().mockResolvedValue(VacationRequestStub()),
            find: jest.fn().mockResolvedValue([VacationRequestStub()]),
            findOneByOrFail: jest.fn().mockResolvedValue(VacationRequestStub()),
            delete: jest.fn().mockResolvedValue({ result: { affected: 1 } }),
          },
        },
        {
          provide: StaffService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 'test',
            }),
          },
        },
      ],
    }).compile()

    service = module.get<VacationRequestService>(VacationRequestService)
    mockVacationRequestRepository = module.get<
      MongoRepository<VacationRequest>
    >(getRepositoryToken(VacationRequest))
  })

  describe('approve vacation request', () => {
    it('should approve a vacation request', async () => {
      const input: ApproveVacationRequestInput = {
        id: mockedObjectId,
        isApproved: true,
        isRejected: false,
        rejectReason: '',
      }
      jest.spyOn(mockVacationRequestRepository, 'findOneByOrFail')
      jest.spyOn(mockVacationRequestRepository, 'save').mockResolvedValue({
        ...VacationRequestStub(),
        ...input,
      })

      const result = await service.approve(input)

      expect(result).toBeDefined()
      expect(result.isApproved).toBe(true)
      expect(result.isRejected).toBe(false)
    })
  })
})
