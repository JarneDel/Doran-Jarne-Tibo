// Common
import { Injectable } from '@nestjs/common'
// Input
import { CreateRoomInput } from './dto/create-room.input'
import { UpdateRoomInput } from './dto/update-room.input'
// MongoDB
import { ObjectId } from 'mongodb'
// TypeOrm
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
// Entities
import { Room } from './entities/room.entity'

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>
  ) {}

  create(createRoomInput: CreateRoomInput): Promise<Room> {
    const r = new Room()
    r.name = createRoomInput.name
    r.pricePerHour = createRoomInput.pricePerHour
    r.SportId = createRoomInput.SportId
    r.type = createRoomInput.type
    r.canBeUsed = createRoomInput.canBeUsed
    
    console.log('Created: ' + r.name)
    
    return this.roomRepository.save(r)
  }

  findAll() {
    return this.roomRepository.find()
  }

  findAllGyms() {
    const AllRooms = this.roomRepository.find()
    const Gyms = AllRooms.then((rooms) => {
      return rooms.filter((room) => room.type === 'Sportzaal')
    })
    return Gyms
  }

  findAllChangingRooms() {
    const AllRooms = this.roomRepository.find()
    const ChangingRooms = AllRooms.then((rooms) => {
      return rooms.filter((room) => room.type === 'Kleedkamer')
    })
    return ChangingRooms
  }

  findAllWorkRooms() {
    const AllRooms = this.roomRepository.find()
    const WorkRooms = AllRooms.then((rooms) => {
      return rooms.filter((room) => room.type === 'Werkruimte')
    })
    return WorkRooms
  }

  findAllSwimmingPools() {
    const AllRooms = this.roomRepository.find()
    const SwimmingPools = AllRooms.then((rooms) => {
      return rooms.filter((room) => room.type === 'Zwembad')
    })
    return SwimmingPools
  }

  findAllDivePools() {
    const AllRooms = this.roomRepository.find()
    const DivePools = AllRooms.then((rooms) => {
      return rooms.filter((room) => room.type === 'Duikput')
    })
    return DivePools
  }

  findByIds(ids: string[]): Promise<Room[]> {
    return this.roomRepository.find({
      // @ts-ignore
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    })
  }

  findOneById(id: string): Promise<Room> {
    const obj = new ObjectId(id)
    console.log(obj)
    // @ts-ignore
    return this.roomRepository.findOne({ _id: new ObjectId(id) })
  }

  async update(id: string, updateRoomInput: UpdateRoomInput) {
    const r = await this.findOneById(id)
    r.name = updateRoomInput.name
    r.pricePerHour = updateRoomInput.pricePerHour
    r.SportId = updateRoomInput.SportId
    r.type = updateRoomInput.type
    r.canBeUsed = updateRoomInput.canBeUsed
    return this.roomRepository.save(r)
  }

  remove(id: string): Promise<string> {
    return this.roomRepository
      .delete(id)
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  }

  // logic for seeding
  save(roomItems: Room[]): Promise<Room[]> {
    return this.roomRepository.save(roomItems)
  }

  truncate(): Promise<void> {
    return this.roomRepository.clear()
  }
}
