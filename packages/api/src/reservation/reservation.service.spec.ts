import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'

import { Test, TestingModule } from '@nestjs/testing'

import { ReservationService } from './reservation.service'

import { Reservation } from './entities/reservation.entity'

import { reservationStub } from './stubs/reservation.stub'
import { createReservationsInputStub } from './stubs/reservation.stub'

import { GroupsService } from 'src/groups/__mocks__/groups.service'
import { RoomService } from 'src/room/__mocks__/room.service'
import { LoanableMaterialsService } from 'src/loanable-materials/__mocks__/loanable-materials.service'

describe('ReservationService', () => {
  let service: ReservationService
  // jest.mock('./reservation.service')
  // jest.mock('../room/room.service')
  // jest.mock('../loanable-materials/loanable-materials.service')
  // jest.mock('../groups/groups.service')
  let mockRepository: Repository<Reservation>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        LoanableMaterialsService,
        GroupsService,
        
        ReservationService,
      ],
    }).compile()

    service = module.get<ReservationService>(ReservationService)
    mockRepository = module.get<Repository<Reservation>>(
      getRepositoryToken(Reservation),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // Test create
  // describe('create()', () => {
  //   describe('when create is called', () => {
  //     it('should call reservation.save() exactly once', async () => {
  //       const reservation = new Reservation()
  //       const saveSpy = jest.spyOn(mockRepository, 'save')

  //       await service.create(reservation)
  //       expect(saveSpy).toBeCalledTimes(1)
  //     })
  //     it('should return a reservation', async () => {
  //       const reservation = await service.create(createReservationsInputStub())
  //       expect(reservation).toEqual(reservationStub())
  //     })
  //   })
  // })

  // // Test findAll
  // describe('findAll()', () => {
  //   describe('when findAll is called', () => {
  //     it('should call reservation.find() once', async () => {
  //       const findSpy = jest.spyOn(mockRepository, 'find')

  //       await service.findAll()
  //       expect(findSpy).toBeCalledTimes(1)
  //     })
  //     it('should return an array of reservations', async () => {
  //       const reservations = await service.findAll()
  //       expect(reservations).toEqual([reservationStub()])
  //     })
  //   })
  // })

  // // Test findOne
  // describe('findOne()', () => {
  //   describe('when findOne is called', () => {
  //     it('should call reservation.findOne() once', async () => {
  //       const findOneSpy = jest.spyOn(mockRepository, 'findOne')

  //       await service.findOne('abc123')
  //       expect(findOneSpy).toBeCalledTimes(1)
  //     })
  //     it('should return a reservation', async () => {
  //       const reservation = await service.findOne('abc123')
  //       expect(reservation).toEqual(reservationStub())
  //     })
  //   })
  // })

  // // Test update
  // describe('update()', () => {
  //   describe('when update is called', () => {
  //     it('should call reservation.update() once', async () => {
  //       const updateSpy = jest.spyOn(mockRepository, 'update')

  //       await service.update('abc123', reservationStub())
  //       expect(updateSpy).toBeCalledTimes(1)
  //     })
  //     it('should return a result object', async () => {
  //       const result = await service.update('abc123', reservationStub())
  //       expect(result).toEqual({ raw: '', affected: 1 })
  //     })
  //   })
  // })
})
