import { Injectable, forwardRef } from '@nestjs/common'
import { CreateReservationInput } from './dto/create-reservation.input'
import { UpdateReservationInput } from './dto/update-reservation.input'
import { Reservation } from './entities/reservation.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { ObjectId } from 'mongodb'
import { RoomService } from 'src/room/room.service'
import { LoanableMaterialsService } from 'src/loanable-materials/loanable-materials.service'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Room } from 'src/room/entities/room.entity'
import { Inject } from '@nestjs/common'

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    // @Inject(forwardRef(() =>RoomService))
    private readonly roomService: RoomService,
    // @Inject(forwardRef(() =>LoanableMaterialsService))
    private readonly loanableMaterialsService: LoanableMaterialsService,
  ) {}
  async create(createReservationInput: CreateReservationInput) {
    const availableRooms = await this.getAvailableRooms(
      createReservationInput.date.toDateString(),
      createReservationInput.startTime,
      createReservationInput.endTime,
    )
    const sportid: string[] = []
    availableRooms.forEach(room => {
      if (!sportid.includes(room.SportId.toString())) {
        sportid.push(room.SportId.toString())
      }
    })
    const availableMaterials = await this.getAvailableMaterail(
      createReservationInput.date.toDateString(),
      createReservationInput.startTime,
      createReservationInput.endTime,
      sportid,
    )
    //check if the room is available
    const reservedRooms = createReservationInput.rooms
    const reservedRoomsId = reservedRooms.map(room => room.id)
    const availableRoomsId = availableRooms.map(room => room.id)
    const isRoomAvailable = reservedRoomsId.every(id =>
      availableRoomsId.includes(id),
    )

    //check if the material is available
    const reservedMaterials = createReservationInput.reservedMaterials
    const reservedMaterialsId = reservedMaterials.map(material => material.id)
    const availableMaterialsId = availableMaterials.map(material => material.id)
    const isMaterialAvailable = reservedMaterialsId.every(id =>
      availableMaterialsId.includes(id),
    )
    //check if the price is correct
    //time difference string to number
    const begintime = createReservationInput.startTime.split(':')
    const endtime = createReservationInput.endTime.split(':')
    const begintimeNumber = Number(begintime[0]) + Number(begintime[1]) / 60
    console.log(begintimeNumber)
    const endtimeNumber = Number(endtime[0]) + Number(endtime[1]) / 60
    // const timediff = createReservationInput.endTime - createReservationInput.startTime
    let totalPrice = 0
    availableRooms.forEach(room => {
      totalPrice += room.pricePerHour
    })
    const r = new Reservation()
    r.date = createReservationInput.date
    r.startTime = createReservationInput.startTime
    r.endTime = createReservationInput.endTime
    r.groupId = createReservationInput.groupId
    r.price = createReservationInput.price
    r.rooms = createReservationInput.rooms
    r.reservedMaterials = createReservationInput.reservedMaterials
    r.isCancelled = false

    return this.reservationRepository.save(r)
  }

  findAll() {
    return this.reservationRepository.find()
  }

  findOne(id: string) {
    //@ts-ignore
    return this.reservationRepository.findOneByOrFail({ _id: new ObjectId(id) })
  }

  findByDate(date: Date) {
    return this.reservationRepository.find({ where: { date: date } })
  }

  async update(id: string, updateReservationInput: UpdateReservationInput) {
    let r = await this.findOne(id)
    r.date = updateReservationInput.date
    r.startTime = updateReservationInput.startTime
    r.endTime = updateReservationInput.endTime
    r.groupId = updateReservationInput.groupId
    r.price = updateReservationInput.price
    r.rooms = updateReservationInput.rooms
    r.reservedMaterials = updateReservationInput.reservedMaterials
    r.isCancelled = updateReservationInput.isCancelled
    // r.rooms = updateReservationInput.rooms;
    // r.reserved_materials = updateReservationInput.reserved_materials;
    return this.reservationRepository.save(r)
  }

  saveAll(services: Reservation[]): Promise<Reservation[]> {
    return this.reservationRepository.save(services)
  }

  truncate() {
    return this.reservationRepository.clear()
  }

  delete(id: string) {
    return this.reservationRepository.delete(id)
  }

  async getAvailableMaterail(
    date: string,
    startTime: string,
    endTime: string,
    SportId: string[],
  ): Promise<LoanableMaterial[]> {
    const materials = (await this.loanableMaterialsService.findAll()).filter(
      material => {
        return SportId.includes(material.SportId.toString())
      },
    ) as unknown as LoanableMaterial[]

    const availableRooms: LoanableMaterial[] = []
    const resurveDate = new Date(date)
    const reservations = await this.findByDate(resurveDate)
    //remove :
    const start = new Date(date + ' ' + startTime)
    const end = new Date(date + ' ' + endTime)
    for (const material of materials) {
      let isAvailable = true
      let overMaterial = material.totalAmount
      for (const reservation of reservations) {
        for (const resMat of reservation.reservedMaterials) {
          //check if the material is reserved
          if (resMat.id.toString() === material.id.toString()) {
            //check if the reservation is in the time
            let reservationStart = new Date(date + ' ' + reservation.startTime)
            let reservationEnd = new Date(date + ' ' + reservation.endTime)
            if (
              (start < reservationStart && end > reservationStart) ||
              (start < reservationEnd && end > reservationEnd) ||
              (reservationStart < start &&
                reservationStart < end &&
                reservationEnd > end)
            ) {
              console.log('🌈🌈')
              overMaterial = overMaterial - resMat.amountReserved
              if (overMaterial < 0) {
                isAvailable = false
              }
            }
          }
        }
      }
      if (isAvailable) {
        console.log(material.totalAmount)
        material.totalAmount = overMaterial
        console.log(overMaterial)
        console.log(material.totalAmount)
        availableRooms.push(material)
      }
    }

    return availableRooms
  }

  async getAvailableRooms(
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<Room[]> {
    const rooms = (await this.roomService.findAll()).filter(
      room =>
        room.type === 'Sportzaal' ||
        room.type === 'Kleedkamer' ||
        room.type === 'Zwembad' ||
        room.type === 'Duikput',
    )

    const availableRooms: Room[] = []
    const resurveDate = new Date(date)
    const reservations = await this.findByDate(resurveDate)
    //remove :
    const start = new Date(date + ' ' + startTime)
    const end = new Date(date + ' ' + endTime)
    for (const room of rooms) {
      let isAvailable = true
      for (const reservation of reservations) {
        for (const resroom of reservation.rooms) {
          if (room.id.toString() === resroom.id.toString()) {
            let reservationStart = new Date(date + ' ' + reservation.startTime)
            let reservationEnd = new Date(date + ' ' + reservation.endTime)
            if (
              (start < reservationStart && end > reservationStart) ||
              (start < reservationEnd && end > reservationEnd) ||
              (reservationStart < start &&
                reservationStart < end &&
                reservationEnd > end)
            ) {
              isAvailable = false
            }
          }
        }
      }
      if (isAvailable) {
        availableRooms.push(room)
      }
    }
    //sort whit first Sporthal second Zwembad third Duikput last Kleedkamer than alfabetecly
    availableRooms.sort((a, b) => {
      if (a.type === b.type) {
        return a.name > b.name ? 1 : -1
      }
      if (a.type === 'Sportzaal') {
        return -1
      }
      if (b.type === 'Sportzaal') {
        return 1
      }
      if (a.type === 'Zwembad') {
        return -1
      }
      if (b.type === 'Zwembad') {
        return 1
      }
      if (a.type === 'Duikput') {
        return -1
      }
      if (b.type === 'Duikput') {
        return 1
      }
      if (a.type === 'Kleedkamer') {
        return -1
      }
      if (b.type === 'Kleedkamer') {
        return 1
      }
    })

    return availableRooms
  }

  // remove(id: string) {
  //   return `This action removes a #${id} reservation`;
  // }
}
