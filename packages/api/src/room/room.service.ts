import { Injectable } from '@nestjs/common'
import { CreateRoomInput } from './dto/create-room.input'
import { UpdateRoomInput } from './dto/update-room.input'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId } from 'mongodb'
import { Repository } from 'typeorm'
import { Room } from './entities/room.entity'

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>
  ) {}
  create(createRoomInput: CreateRoomInput) {
    const r = new Room()
    const { name, sport, price, type } = createRoomInput
    r.name = name
    r.sport = sport
    r.price = price
    r.type = type
    return this.roomRepository.save(r)
  }

  findAll() {
    return this.roomRepository.find()
  }

  findOne(id: string) {
    console.log('id', id)
    const objectId = new ObjectId(id)
    return this.roomRepository.findOneByOrFail({
      //@ts-ignore
      _id: objectId,
    })
  }

  update(id: string, updateRoomInput: UpdateRoomInput) {
    return `This action updates a #${id} room`
  }

  remove(id: string) {
    return `This action removes a #${id} room`
  }

  // logic for seeding
  saveAll(roomItems: Room[]): Promise<Room[]> {
    return this.roomRepository.save(roomItems)
  }
  truncate(): Promise<void> {
    return this.roomRepository.clear()
  }
}
