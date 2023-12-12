import { Test, TestingModule } from '@nestjs/testing'
import { ReservationResolver } from './reservation.resolver'
import { ReservationService } from './reservation.service'
import { GroupsService } from 'src/groups/groups.service'
import { UsersService } from 'src/users/users.service'
import { StaffService } from 'src/staff/staff.service'
import { reservationStub } from './stubs/reservation.stub'
import { CreateReservationInput } from './dto/create-reservation.input'
import { roomStub } from 'src/room/stubs/room.stub'
import { loanableMaterialStub } from 'src/loanable-materials/stubs/loanable-materials.stub'
import { UserRecord } from 'firebase-admin/auth'
import { UpdateReservationInput } from './dto/update-reservation.input'

jest.mock('./reservation.service')
jest.mock('../groups/groups.service')
jest.mock('../staff/staff.service')
describe('ReservationResolver', () => {
  let resolver: ReservationResolver
  let mockReservationService: ReservationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationResolver,
        ReservationService,
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

    resolver = module.get<ReservationResolver>(ReservationResolver)
    mockReservationService = module.get<ReservationService>(ReservationService)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  // Test create
  describe('create Reservation', () => {
    let myReservationDTO: CreateReservationInput
    let resultReservations

    beforeEach(async () => {
      myReservationDTO = {
        date: new Date(),
        startTime: '08:00',
        endTime: '09:00',
        groupId: '1',
        rooms: [roomStub()],
        reservedMaterials: [reservationStub().reservedMaterials[0]],
        price: 0,
      }
      resultReservations = await resolver.createReservation(myReservationDTO)
    })

    it('should call the create method of the ReservationService', () => {
      expect(mockReservationService.create).toHaveBeenCalledWith(
        myReservationDTO,
      )
    })

    it('should return a reservation', () => {
      expect(resultReservations).toEqual(reservationStub())
    })
  })

  // Test findAll
  describe('findAll', () => {
    let resultReservations

    beforeEach(async () => {
      resultReservations = await resolver.findAll()
    })

    it('should call the findAll method of the ReservationService', () => {
      expect(mockReservationService.findAll).toHaveBeenCalled()
    })

    it('should return a list of reservations', () => {
      expect(resultReservations).toEqual([reservationStub()])
    })
  })

  // Test findOne
  describe('findOne', () => {
    let resultReservation
    const user: UserRecord = {
      uid: '1',
      displayName: 'test',
      email: 'test@test.test',
      emailVerified: true,
      phoneNumber: '123456789',
      photoURL: 'test',
      disabled: false,
      metadata: {
        lastSignInTime: '1',
        creationTime: '1',
        toJSON: jest.fn(),
      },
      providerData: [
        {
          uid: '1',
          displayName: 'test',
          email: 'test@test.test',
          phoneNumber: '123456789',
          photoURL: 'test',
          providerId: '1',
          toJSON: jest.fn(),
        },
      ],
      toJSON: jest.fn(),
    }

    beforeEach(async () => {
      resultReservation = await resolver.findOne('1', user)
    })

    it('should call the findOne method of the ReservationService', () => {
      expect(mockReservationService.findOne).toHaveBeenCalledWith('1')
    })

    it('should return a reservation', () => {
      expect(resultReservation).toEqual(reservationStub())
    })
  })

  // Test findByDate
  describe('findByDate', () => {
    let resultReservations

    beforeEach(async () => {
      resultReservations = await resolver.findByDate(new Date())
    })

    it('should call the findByDate method of the ReservationService', () => {
      expect(mockReservationService.findByDate).toHaveBeenCalled()
    })

    it('should return a list of reservations', () => {
      expect(resultReservations).toEqual([reservationStub()])
    })
  })

  // Test findByDateAndUser
  describe('findByDateAndUser', () => {
    let resultReservations
    const user: UserRecord = {
      uid: 'abc123',
      displayName: 'test',
      email: 'test@test.test',
      emailVerified: true,
      phoneNumber: '123456789',
      photoURL: 'test',
      disabled: false,
      metadata: {
        lastSignInTime: '1',
        creationTime: '1',
        toJSON: jest.fn(),
      },
      providerData: [
        {
          uid: '1',
          displayName: 'test',
          email: 'test@test.test',
          phoneNumber: '123456789',
          photoURL: 'test',
          providerId: '1',
          toJSON: jest.fn(),
        },
      ],
      toJSON: jest.fn(),
    }

    beforeEach(async () => {
      resultReservations = await resolver.findByDateAndUser(new Date(), user)
    })

    it('should call the findByDateAndUser method of the ReservationService', () => {
      expect(mockReservationService.findByDateAndUser).toHaveBeenCalled()
    })

    it('should return a list of reservations', () => {
      expect(resultReservations).toEqual([reservationStub()])
    })
  })

  // Test update
  describe('update', () => {
    let resultReservation
    let myReservationDTO: UpdateReservationInput

    beforeEach(async () => {
      myReservationDTO = {
        id: '1',
        date: new Date(),
        startTime: '08:00',
        endTime: '09:00',
        groupId: '1',
        rooms: [roomStub()],
        reservedMaterials: [reservationStub().reservedMaterials[0]],
        price: 0,
        isCancelled: false,
      }
      resultReservation = await resolver.updateReservation(myReservationDTO)
    })

    it('should call the update method of the ReservationService', () => {
      expect(mockReservationService.update).toHaveBeenCalledWith(
        '1',
        myReservationDTO,
      )
    })

    it('should return a reservation', () => {
      expect(resultReservation).toEqual(reservationStub())
    })
  })

  // Test cancelReservation
  describe('cancelReservation', () => {
    let resultReservation

    beforeEach(async () => {
      resultReservation = await resolver.canselReservation('1')
    })

    it('should call the cancelReservation method of the ReservationService', () => {
      expect(mockReservationService.cancelReservation).toHaveBeenCalledWith('1')
    })

    it('should return a reservation', () => {
      expect(resultReservation).toEqual(reservationStub())
    })
  })

})
