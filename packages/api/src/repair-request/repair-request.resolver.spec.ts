import { Test, TestingModule } from '@nestjs/testing'
import { RepairRequestResolver } from './repair-request.resolver'

import { RepairRequestService } from './repair-request.service'
import { CreateRepairRequestInput } from './dto/create-repair-request.input'

//Stubs
import {
  createRepairRequestInputStub,
  repairRequestStub,
} from './stubs/repair-request.stub'

import { GroupsService } from 'src/groups/groups.service'
import { StaffService } from 'src/staff/staff.service'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'

// Gebruik maken van de gemockte service
jest.mock('./repair-request.service')
jest.mock('../reservation/reservation.service')
jest.mock('../staff/staff.service')
jest.mock('../groups/groups.service')

describe('RepairRequestResolver', () => {
  let resolver: RepairRequestResolver
  let mockRepairRequestService: RepairRequestService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepairRequestResolver,
        RepairRequestService,
        StaffService,
        GroupsService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        }
      ],
    }).compile()

    resolver = module.get<RepairRequestResolver>(RepairRequestResolver)
    mockRepairRequestService = module.get<RepairRequestService>(
      RepairRequestService
    )
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  // Test create
  describe('create RepairRequest', () => {
    let myRepairDTO: CreateRepairRequestInput
    let resultRepairRequests

    beforeEach(async () => {
      myRepairDTO = {
        title: createRepairRequestInputStub().title,
        description: createRepairRequestInputStub().description,
        requestUserId: createRepairRequestInputStub().requestUserId,
        room: createRepairRequestInputStub().room,
        loanableMaterial: createRepairRequestInputStub().loanableMaterial,
      }
      resultRepairRequests = await resolver.createRepairRequest(myRepairDTO)
    })

    it('should call repairRequestService.create exactly once', () => {
      expect(mockRepairRequestService.create).toHaveBeenCalledTimes(1)
    })
    it('should return a repairRequest', () => {
      expect(resultRepairRequests).toEqual(repairRequestStub())
    })
    it('should call repairRequestService.create with the correct arguments', () => {
      expect(mockRepairRequestService.create).toHaveBeenCalledWith(myRepairDTO)
    })
  })
})
