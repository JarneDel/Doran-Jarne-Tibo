import { CreateRoomInput } from "../dto/create-room.input";
import { UpdateRoomInput } from "../dto/update-room.input";
import { Room } from "../entities/room.entity";


export const createRoomInputStub = (): CreateRoomInput=>{
  const room = new CreateRoomInput()
  room.name = 'Room 1'
  room.pricePerHour = 100
  room.type = 'Sportzaal'
  room.SportId = ['656a1085a90f2e4962ae915a']
  room.canBeUsed=true
  return room
}

export const updateRoomInputStub = (): UpdateRoomInput=>{
  const room = new UpdateRoomInput()
  room.name = 'Room 1'
  room.pricePerHour = 100
  room.type = 'Sportzaal'
  room.SportId = ['656a1085a90f2e4962ae915a']
  room.canBeUsed=true
  return room
}

export const roomStub=():Room=>{
  const room = new Room()
  room.id = '656a1085a90f2e4962ae915a'
  room.name='Room 1'
  room.pricePerHour=100
  room.type='Sportzaal'
  room.SportId = ['656a1085a90f2e4962ae915a']
  room.sports = [
    {
      id: '656a1085a90f2e4962ae915a',
      name: 'test',
      description: 'test',
      createdAt: new Date('2023-12-07T15:04:51.996Z'),
      updatedAt: new Date('2023-12-07T15:04:51.996Z'),
    },
  ]
  room.canBeUsed=true
  room.createdAt = new Date('2023-12-07T15:04:51.996Z')
  room.updatedAt = new Date('2023-12-07T15:04:51.996Z')
  return room
}