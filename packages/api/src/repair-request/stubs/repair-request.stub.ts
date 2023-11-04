import { Rooms } from 'src/reservation/entities/room.entity'
import { Materials } from 'src/reservation/entities/material.entity'
import { CreateRepairRequestInput } from '../dto/create-repair-request.input'
import { RepairRequest } from '../entities/repair-request.entity'

export const createRepairRequestInputStub = (): CreateRepairRequestInput => {
  //Room
  const rooms: Rooms[] = []
  const room = new Rooms()
  room.name = 'Room 1'
  room.pricePerHour = 100
  room.type = 'Sportzaal'
  rooms.push(room)

  //LoanableMeterial
  const materials: Materials[] = []
  const l = new Materials()
  l.name = 'Test'
  l.description = 'Test'
  l.price = 100
  l.wantedAmount = 5
  l.totalAmount = 3
  l.sports = [
    {
      id: '65390cd4eaf47eda6fd47bc3',
      name: 'Voetbal',
      createdAt: new Date('2023-10-25T12:40:52.538Z'),
      updatedAt: new Date('2023-10-25T12:40:52.538Z'),
    },
    {
      id: '65390cd4eaf47eda6fd47bc4',
      name: 'Tennis',
      createdAt: new Date('2023-10-25T12:40:52.563Z'),
      updatedAt: new Date('2023-10-25T12:40:52.563Z'),
    },
    {
      id: '65390cd4eaf47eda6fd47bc5',
      name: 'Basketbal',
      createdAt: new Date('2023-10-25T12:40:52.563Z'),
      updatedAt: new Date('2023-10-25T12:40:52.563Z'),
    },
  ]

  //RepairRequest
  const rr = new CreateRepairRequestInput()
  rr.description = 'Test'
  rr.requestUserId = '1'
  rr.room = rooms
  rr.loanableMaterial = materials

  return rr
}

export const repairRequestStub = (): RepairRequest => {
  const repairRequest = new RepairRequest()
  repairRequest.id = 'abc123'
  repairRequest.description = 'Test'
  repairRequest.requestUserId = '1'
  repairRequest.room = []
  repairRequest.loanableMaterial = []
  repairRequest.isRepaired = false

  return repairRequest
}
