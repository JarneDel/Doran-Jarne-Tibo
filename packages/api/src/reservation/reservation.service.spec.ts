import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Test, TestingModule } from '@nestjs/testing'

import { ReservationService } from './reservation.service'

import { Reservation } from './entities/reservation.entity'

import { reservationStub } from './stubs/reservation.stub'
import { createReservationsInputStub } from './stubs/reservation.stub'

import { GroupsService } from 'src/groups/groups.service'
jest.mock('src/groups/groups.service')
import { RoomService } from 'src/room/room.service'
jest.mock('src/room/room.service')
import { LoanableMaterialsService } from 'src/loanable-materials/loanable-materials.service'
jest.mock('src/loanable-materials/loanable-materials.service')

describe('ReservationService', () => {
  let service: ReservationService
  let mockRepository: Repository<Reservation>
  let mockRoomService: RoomService
  let mockGroupsService: GroupsService
  let mockLoanableMaterialsService: LoanableMaterialsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        RoomService,
        GroupsService,
        LoanableMaterialsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            save: jest.fn().mockResolvedValue(reservationStub()),
            find: jest.fn().mockResolvedValue([reservationStub()]),
            findOneByOrFail: jest.fn().mockResolvedValue(reservationStub()),
            update: jest.fn().mockResolvedValue({ raw: '', affected: 1 }),
          },
        },
      ],
    }).compile()

    service = module.get<ReservationService>(ReservationService)
    mockRepository = module.get<Repository<Reservation>>(
      getRepositoryToken(Reservation),
    )
    mockRoomService = module.get<RoomService>(RoomService)
    mockGroupsService = module.get<GroupsService>(GroupsService)
    mockLoanableMaterialsService = module.get<LoanableMaterialsService>(
      LoanableMaterialsService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // Test create
  describe('create()', () => {
    describe('when create is called', () => {
      it('should call reservation.save() exactly once', async () => {
        // const reservation = createReservationsInputStub()

        const saveSpy = jest.spyOn(mockRepository, 'save')
        const findSpy = jest.spyOn(mockRepository, 'find').mockResolvedValue(new Promise((resolve, reject) => {
          resolve([])
        }))
        await service.create(createReservationsInputStub())
        expect(saveSpy).toBeCalledTimes(1)
      })
      it('should return a reservation', async () => {
        const findSpy = jest.spyOn(mockRepository, 'find').mockResolvedValue(new Promise((resolve, reject) => {
          resolve([])
        }))
        const reservation = await service.create(createReservationsInputStub())
        expect(reservation).toEqual(reservationStub())
      })
    })
  })

  // Test findAll
  describe('findAll()', () => {
    describe('when findAll is called', () => {
      it('should call reservation.find() once', async () => {
        const findSpy = jest.spyOn(mockRepository, 'find')

        await service.findAll()
        expect(findSpy).toBeCalledTimes(1)
      })
      it('should return an array of reservations', async () => {
        const reservations = await service.findAll()
        expect(reservations).toEqual([reservationStub()])
      })
    })
  })

  // Test findOne
  describe('findOne()', () => {
    describe('when findOne is called', () => {
      it('should call reservation.findOne() once', async () => {
        const findOneSpy = jest.spyOn(mockRepository, 'findOneByOrFail')

        await service.findOne('656a1086a90f2e4962ae91b1')
        expect(findOneSpy).toBeCalledTimes(1)
      })
      it('should return a reservation', async () => {
        const reservation = await service.findOne('656a1086a90f2e4962ae91b1')
        expect(reservation).toEqual(reservationStub())
      })
    })
  })

  // Test update
  describe('update()', () => {
    describe('when update is called', () => {
      it('should call reservation.update() once', async () => {
        const updateSpy = jest.spyOn(mockRepository, 'update')

        await service.update('656a1086a90f2e4962ae91b1', reservationStub())
        expect(updateSpy).toBeCalledTimes(1)
      })
      it('should return a result object', async () => {
        const result = await service.update(
          '656a1086a90f2e4962ae91b1',
          reservationStub(),
        )
        expect(result).toEqual(reservationStub())
      })
    })
  })
})
