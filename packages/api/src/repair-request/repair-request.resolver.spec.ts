import { Test, TestingModule } from '@nestjs/testing'
import { RepairRequestResolver } from './repair-request.resolver'

import { RepairRequestService } from './repair-request.service'
import { CreateRepairRequestInput } from './dto/create-repair-request.input'
import { UpdateRepairRequestInput } from './dto/update-repair-request.input'

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
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
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


  // Test findAll
  describe('findAll RepairRequests', () => {
    let resultRepairRequests

    beforeEach(async () => {
      resultRepairRequests = await resolver.findAll()
    })

    it('should call repairRequestService.findAll exactly once', () => {
      expect(mockRepairRequestService.findAll).toHaveBeenCalledTimes(1)
    })
    it('should return an array of repairRequests', () => {
      expect(resultRepairRequests).toEqual([repairRequestStub()])
    })
  })

  // Test findOne
  // describe('findOne RepairRequest', () => {
  //   let resultRepairRequest

  //   beforeEach(async () => {
  //     resultRepairRequest = await resolver.findOne('abc123')
  //   })

  //   it('should call repairRequestService.findOne exactly once', () => {
  //     expect(mockRepairRequestService.findOneById).toHaveBeenCalledTimes(1)
  //   })
  //   it('should return a repairRequest', () => {
  //     expect(resultRepairRequest).toEqual(repairRequestStub())
  //   })
  //   it('should call repairRequestService.findOne with the correct arguments', () => {
  //     expect(mockRepairRequestService.findOneById).toHaveBeenCalledWith(1)
  //   })
  // })

  
  // Test update
  describe('update RepairRequest', () => {
    let myRepairDTO: UpdateRepairRequestInput
    let resultRepairRequests

    beforeEach(async () => {
      myRepairDTO = {
        id: 'abc123',
        isRepaired: true,
        urgency: 1,
        title: createRepairRequestInputStub().title,
        description: createRepairRequestInputStub().description,
        room: createRepairRequestInputStub().room,
        loanableMaterial: createRepairRequestInputStub().loanableMaterial,
      }
      resultRepairRequests = await resolver.updateRepairRequest(myRepairDTO)
    })

    it('should call repairRequestService.update exactly once', () => {
      expect(mockRepairRequestService.update).toHaveBeenCalledTimes(1)
    })
    it('should return a repairRequest', () => {
      expect(resultRepairRequests).toEqual(repairRequestStub())
    })
    it('should call repairRequestService.update with the correct arguments', () => {
      expect(mockRepairRequestService.update).toHaveBeenCalledWith('abc123',myRepairDTO)
    })
  })

  
  // Test remove
  describe('remove RepairRequest', () => {
    let resultRepairRequests

    beforeEach(async () => {
      resultRepairRequests = await resolver.RemoveRepairRequestById('abc123')
    })

    it('should call repairRequestService.remove exactly once', () => {
      expect(mockRepairRequestService.remove).toHaveBeenCalledTimes(1)
    })
    // it('should return a string', () => {
    //   expect(resultRepairRequests).toEqual(
    //     'Deleted repair-request with id: abc123successfully',
    //   )
    // })
    it('should call repairRequestService.remove with the correct arguments', () => {
      expect(mockRepairRequestService.remove).toHaveBeenCalledWith('abc123')
    })
  })

})
