import { CreateReservationInput } from '../dto/create-reservation.input'
import { Materials } from '../entities/material.entity'
import { Reservation } from '../entities/reservation.entity'
import { Rooms } from '../entities/room.entity'

export const createReservationsInputStub = (): CreateReservationInput => {
  //Room
  const rooms: [Rooms] = [
    {
      id: 'abc123',
      name: 'Room 1',
      pricePerHour: 100,
      type: 'Sportzaal',
      sports: [
        {
          id: '1',
          name: 'Voetbal',
          description: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ]

  //LoanableMeterial
  const materials: [Materials] = [
    {
      id: 'test',
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
          id: '1',
          name: 'Voetbal',
          description: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ]

  //reservation
  const reservation = new CreateReservationInput()
  reservation.date = new Date()
  reservation.endTime = '18:00'
  reservation.startTime = '08:00'
  reservation.groupId = 'abc123'
  reservation.price = 12
  reservation.reservedMaterials = materials
  reservation.rooms = rooms
  return reservation
}

export const reservationStub = (): Reservation => {
  const reservation = new Reservation()
  reservation.id = 'abc123'
  reservation.date = new Date()
  reservation.endTime = '18:00'
  reservation.startTime = '08:00'
  reservation.groupId = 'abc123'
  reservation.price = 12
  reservation.reservedMaterials = [
    {
      id: 'test',
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
          id: '1',
          name: 'Voetbal',
          description: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ]
  reservation.rooms = [
    {
      id: 'abc123',
      name: 'Room 1',
      pricePerHour: 100,
      type: 'Sportzaal',
      sports: [
        {
          id: '1',
          name: 'Voetbal',
          description: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ]

  return reservation
}
