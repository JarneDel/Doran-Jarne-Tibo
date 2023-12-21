import { Test, TestingModule } from '@nestjs/testing'
import { RoomResolver } from './room.resolver'
import { RoomService } from './room.service'
import { SportService } from 'src/sport/sport.service'
import { GroupsService } from 'src/groups/groups.service'
import { UsersService } from 'src/users/users.service'
import { StaffService } from 'src/staff/staff.service'
import { roomStub } from './stubs/room.stub'

jest.mock('./room.service')
jest.mock('../sport/sport.service')
jest.mock('../groups/groups.service')
jest.mock('../staff/staff.service')

describe('RoomResolver', () => {
  let resolver: RoomResolver
  let service: RoomService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomResolver,
        RoomService,
        SportService,
        StaffService,
        GroupsService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    resolver = module.get<RoomResolver>(RoomResolver)
    service = module.get<RoomService>(RoomService)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  // Test create
  describe('create Room', () => {
    let myRoomDTO
    let resultRoom

    beforeEach(async () => {
      myRoomDTO = {
        name: 'test',
        sportId: '1',
        quantity: 1,
        price: 0,
      }
      resultRoom = await resolver.createRoom(myRoomDTO)
    })

    it('should call the service', () => {
      expect(service.create).toHaveBeenCalledWith(myRoomDTO)
    })

    it('should return a Room', () => {
      expect(resultRoom).toEqual(roomStub())
    })
  })

  // Test findAll
  describe('findAll Rooms', () => {
    let resultRooms

    beforeEach(async () => {
      resultRooms = await resolver.findAll()
    })

    it('should call the service', () => {
      expect(service.findAll).toHaveBeenCalled()
    })

    it('should return an array of Rooms', () => {
      expect(resultRooms).toEqual([roomStub()])
    })
  })

  // Test findAllGyms
  describe('findAll Gyms', () => {
    let resultRooms

    beforeEach(async () => {
      resultRooms = await resolver.findAllGyms()
    })

    it('should call the service', () => {
      expect(service.findAllGyms).toHaveBeenCalled()
    })

    it('should return an array of Rooms', () => {
      expect(resultRooms).toEqual([roomStub()])
    })
  })

  // Test findAllChangingRooms
  describe('findAll ChangingRooms', () => {
    let resultRooms

    beforeEach(async () => {
      resultRooms = await resolver.findAllChangingRooms()
    })

    it('should call the service', () => {
      expect(service.findAllChangingRooms).toHaveBeenCalled()
    })

    it('should return an array of Rooms', () => {
      expect(resultRooms).toEqual([roomStub()])
    })
  })

  // Test findAllWorkRooms
  describe('findAll WorkRooms', () => {
    let resultRooms

    beforeEach(async () => {
      resultRooms = await resolver.findAllWorkRooms()
    })

    it('should call the service', () => {
      expect(service.findAllWorkRooms).toHaveBeenCalled()
    })

    it('should return an array of Rooms', () => {
      expect(resultRooms).toEqual([roomStub()])
    })
  })

  // Test findAllSwimmingPools
  describe('findAll SwimmingPools', () => {
    let resultRooms

    beforeEach(async () => {
      resultRooms = await resolver.findAllSwimmingPools()
    })

    it('should call the service', () => {
      expect(service.findAllSwimmingPools).toHaveBeenCalled()
    })

    it('should return an array of Rooms', () => {
      expect(resultRooms).toEqual([roomStub()])
    })
  })

  // Test findAllDivePools
  describe('findAll DivePools', () => {
    let resultRooms

    beforeEach(async () => {
      resultRooms = await resolver.findAllDivePools()
    })

    it('should call the service', () => {
      expect(service.findAllDivePools).toHaveBeenCalled()
    })

    it('should return an array of Rooms', () => {
      expect(resultRooms).toEqual([roomStub()])
    })
  })

  // Test findOne
  describe('findOne Room', () => {
    let resultRoom

    beforeEach(async () => {
      resultRoom = await resolver.findOneById('1')
    })

    it('should call the service', () => {
      expect(service.findOneById).toHaveBeenCalledWith('1')
    })

    it('should return a Room', () => {
      expect(resultRoom).toEqual(roomStub())
    })
  })

  // Test update
  describe('update Room', () => {
    let myRoomDTO
    let resultRoom

    beforeEach(async () => {
      myRoomDTO = {
        name: 'test',
        sportId: '1',
        quantity: 1,
        price: 0,
      }
      resultRoom = await resolver.updateRoom(myRoomDTO)
    })

    it('should call the service', () => {
      expect(service.update).toHaveBeenCalledWith(myRoomDTO._id, myRoomDTO)
    })

    it('should return a Room', () => {
      expect(resultRoom).toEqual(roomStub())
    })
  })

  // Test remove
  describe('remove Room', () => {
    let resultRoom

    beforeEach(async () => {
      resultRoom = await resolver.removeRoomById('1')
    })

    it('should call the service', () => {
      expect(service.remove).toHaveBeenCalledWith('1')
    })

    it('should return a Room', () => {
      expect(resultRoom).toEqual('Deleted room with id: 1 succesfully')
    })
  })
})
