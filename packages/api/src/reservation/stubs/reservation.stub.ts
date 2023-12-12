import { CreateReservationInput } from '../dto/create-reservation.input'
import { Materials } from '../entities/material.entity'
import { Reservation } from '../entities/reservation.entity'
import { Rooms } from '../entities/room.entity'

export const createReservationsInputStub = (): CreateReservationInput => {
  //Room
  const rooms: [Rooms] = [
    {
      id: '656a1085a90f2e4962ae915a',
      name: 'Room 1',
      pricePerHour: 100,
      type: 'Sportzaal',
      sports: [
        {
          id: '656a1085a90f2e4962ae915a',
          name: 'Voetbal',
          description: 'Test',
          createdAt: new Date('2023-12-07T15:04:51.996Z'),
          updatedAt: new Date('2023-12-07T15:04:51.996Z'),
        },
      ],
    },
  ]

  //LoanableMeterial
  const materials: [Materials] = [
    {
      id: '656a1085a90f2e4962ae915a',
      name: 'Test',
      description: 'Test',
      price: 100,
      wantedAmount: 5,
      totalAmount: 3,
      isComplete: true,
      amountReserved: 1,

      // l.sports = ['Voetbal', 'Tennis', 'Basketbal']
      sports: [
        {
          id: '656a1085a90f2e4962ae915a',
          name: 'Voetbal',
          description: 'Test',
          createdAt: new Date('2023-12-07T15:04:51.996Z'),
          updatedAt: new Date('2023-12-07T15:04:51.996Z'),
        },
      ],
    },
  ]
  //reservation
  const reservation = new CreateReservationInput()
  reservation.date = new Date('2023-12-09T15:04:51.996Z')
  reservation.endTime = '18:00'
  reservation.startTime = '08:00'
  reservation.groupId = '656a1085a90f2e4962ae915a'
  reservation.price = 12
  reservation.reservedMaterials = materials
  reservation.rooms = rooms
  return reservation
}

export const reservationStub = (): Reservation => {
  const reservation = new Reservation()
  reservation.id = '656a1086a90f2e4962ae91b1'
  reservation.date = new Date('2024-01-13T00:00:00.000+00:00')
  reservation.endTime = '18:00'
  reservation.startTime = '08:00'
  reservation.groupId = '656a1085a90f2e4962ae915a'
  reservation.price = 2000
  reservation.isCancelled = false
  reservation.reservedMaterials = [
    {
      id: '656a1085a90f2e4962ae915a',
      name: 'Test',
      description: 'Test',
      price: 100,
      wantedAmount: 5,
      totalAmount: 3,
      isComplete: true,
      amountReserved: 1,

      // l.sports = ['Voetbal', 'Tennis', 'Basketbal']
      sports: [
        {
          id: '656a1085a90f2e4962ae915a',
          name: 'Voetbal',
          description: 'Test',
          createdAt: new Date('2023-12-07T15:04:51.996Z'),
          updatedAt: new Date('2023-12-07T15:04:51.996Z'),
        },
      ],
    },
  ]
  reservation.rooms = [
    {
      id: '656a1085a90f2e4962ae915a',
      name: 'Room 1',
      pricePerHour: 100,
      type: 'Sportzaal',
      sports: [
        {
          id: '656a1085a90f2e4962ae915a',
          name: 'Voetbal',
          description: 'Test',
          createdAt: new Date('2023-12-07T15:04:51.996Z'),
          updatedAt: new Date('2023-12-07T15:04:51.996Z'),
        },
      ],
    },
  ]

  return reservation
}
