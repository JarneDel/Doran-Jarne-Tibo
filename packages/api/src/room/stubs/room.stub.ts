import { CreateRoomInput } from "../dto/create-room.input";
import { Room } from "../entities/room.entity";


export const createRoomInputStub = (): CreateRoomInput=>{
  const room = new CreateRoomInput()
  room.name = 'Room 1'
  room.pricePerHour = 100
  room.type = 'Sportzaal'
  room.SportId=['abc123']
  room.canBeUsed=true
  return room
}

export const roomStub=():Room=>{
  const room = new Room()
  room.SportId=["abc123"]
  room.sports=[{
    id:'abc123',
    name:'test',
    description:'test',
    createdAt:new Date(),
    updatedAt:new Date()
  }]
  room.canBeUsed=true
  room.id='abc123'
  room.name='Room 1'
  room.pricePerHour=100
  room.type='Sportzaal'
  room.createdAt=new Date()
  room.updatedAt=new Date()
  return room
}