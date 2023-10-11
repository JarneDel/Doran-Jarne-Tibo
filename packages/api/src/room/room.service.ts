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

  create(createRoomInput: CreateRoomInput) {
    const r = new Room()
    const { name, sports, pricePerHour, type } = createRoomInput
    r.name = name
    r.sports = sports
    r.pricePerHour = pricePerHour
    r.type = type
    return this.roomRepository.save(r)
  }

  findAll() {
    return this.roomRepository.find()
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
    r.sports = updateRoomInput.sports
    r.type = updateRoomInput.type
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
