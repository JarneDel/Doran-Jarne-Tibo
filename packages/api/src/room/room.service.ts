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
import { ReservationService } from 'src/reservation/reservation.service'

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly reservationService: ReservationService,
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

  findByIds(ids: string[]): Promise<Room[]> {
    return this.roomRepository.find({
      // @ts-ignore
      _id: { $in: ids.map(id => new ObjectId(id)) },
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
      .then(res => {
        return res
      })
      .catch(err => {
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
  async getAvailableRooms(
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<Room[]> {
    const rooms = (await this.findAll()).filter(
      room =>
        room.type === 'Sportzaal' ||
        room.type === 'Kleedkamer' ||
        room.type === 'Zwembad' ||
        room.type === 'Duikput',
    )

    const availableRooms: Room[] = []
    const resurveDate = new Date(date)
    const reservations = await this.reservationService.findByDate(resurveDate)
    //remove :
    const start = new Date(date + ' ' + startTime)
    const end = new Date(date + ' ' + endTime)
    for (const room of rooms) {
      let isAvailable = true
      // console.log(room.name)
      for (const reservation of reservations) {
        for (const resroom of reservation.rooms) {
          // console.log(room.id, resroom.id)
          // console.log(room.id.toString() === resroom.id.toString())
          if (room.id.toString() === resroom.id.toString()) {
            let reservationStart = new Date(date + ' ' + reservation.startTime)
            let reservationEnd = new Date(date + ' ' + reservation.endTime)
            if (
              (start < reservationStart && end > reservationStart) ||
              (start < reservationEnd && end > reservationEnd)
            ) {
              isAvailable = false
              console.log('Room not available: ' + room.name)
            }
          }
        }
      }
      if (isAvailable) {
        availableRooms.push(room)
      }
    }

    return availableRooms
  }
}
