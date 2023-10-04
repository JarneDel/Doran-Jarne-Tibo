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

  findOneById(id: string): Promise<Room> {
    const obj = new ObjectId(id);
    console.log(obj);
    // @ts-ignore
    return this.roomRepository.findOne({ _id: new ObjectId(id) });
  }

  update(id: string, updateRoomInput: UpdateRoomInput) {
    return `This action updates a #${id} room`
  }

  remove(id: string) {
    return this.roomRepository.delete(id)
  }

  // logic for seeding
  save(roomItems: Room[]): Promise<Room[]> {
    return this.roomRepository.save(roomItems)
  }
  truncate(): Promise<void> {
    return this.roomRepository.clear()
  }
}
