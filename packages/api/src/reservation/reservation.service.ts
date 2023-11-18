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
      createReservationInput.date.toISOString().substr(0, 10),
      createReservationInput.startTime,
      createReservationInput.endTime,
    )
    const sportid: string[] = []
    availableRooms.forEach(room => {
      room.SportId.forEach(sport => {
        if (!sportid.includes(sport.toString())) {
          sportid.push(sport.toString())
        }
      })
    })
    const availableMaterials = await this.getAvailableMaterail(
      createReservationInput.date.toISOString(),
      createReservationInput.startTime,
      createReservationInput.endTime,
      sportid,
    )
    //check if the room is available
    const reservedRooms = createReservationInput.rooms
    const reservedRoomsId = reservedRooms.map(room => room.id)
    const availableRoomsId = availableRooms.map(room => room.id)
    let isRoomAvailable = true
    reservedRooms.map(room => {
      let roomisAvailable = false
      availableRoomsId.map(id => {
        if (room.id.toString() == id.toString()) {
          roomisAvailable = true
        }
      })

      if (roomisAvailable == false) {
        isRoomAvailable = false
      }
    })
    const date = createReservationInput.date
    //get date of today at 00:00:00
    const today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    )
    //check if the material is available
    const reservedMaterials = createReservationInput.reservedMaterials
    const reservedMaterialsId = reservedMaterials.map(material => material.id)
    const availableMaterialsId = availableMaterials.map(material => material.id)
    const isMaterialAvailable = true
    reservedMaterials.map(material => {
      let materialisAvailable = false
      availableMaterialsId.map(id => {
        if (
          material.id.toString() == id.toString() &&
          material.amountReserved < material.totalAmount
        ) {
          materialisAvailable = true
        }
      })
      if (materialisAvailable == false) {
        isRoomAvailable = false
      }
    })

    //check if the price is correct
    //time difference string to number
    const begintime = createReservationInput.startTime.split(':')
    const endtime = createReservationInput.endTime.split(':')
    const begintimeNumber = Number(begintime[0]) + Number(begintime[1]) / 60
    const endtimeNumber = Number(endtime[0]) + Number(endtime[1]) / 60
    const timediff = endtimeNumber - begintimeNumber
    let totalPrice = 0
    createReservationInput.rooms.map(room => {
      totalPrice += room.pricePerHour * timediff
    })
    createReservationInput.reservedMaterials.map(material => {
      totalPrice += material.price * timediff
    })
    createReservationInput.price = totalPrice
    if (isRoomAvailable && isMaterialAvailable && date >= today) {
      const r = new Reservation()
      const id = new ObjectId(createReservationInput.groupId)
      r.date = createReservationInput.date
      r.startTime = createReservationInput.startTime
      r.endTime = createReservationInput.endTime
      r.groupId = id.toString()
      r.price = createReservationInput.price
      r.rooms = createReservationInput.rooms
      r.reservedMaterials = createReservationInput.reservedMaterials
      r.isCancelled = false

      return this.reservationRepository.save(r)
    } else {
      throw new Error(
        'Room or material is not available or date is not correct',
      )
    }
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
  findByDateAndUser(date: Date, userId: string) {
    const id = userId.toString()
    return this.reservationRepository.find({
      where: { date: date, groupId: id, isCancelled: false },
    })
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
        if (reservation.isCancelled) {
          continue
        }
        for (const resMat of reservation.reservedMaterials) {
          //check if the material is reserved
          if (resMat.id.toString() === material.id.toString()) {
            //check if the reservation is in the time
            let reservationStart = new Date(date + ' ' + reservation.startTime)
            let reservationEnd = new Date(date + ' ' + reservation.endTime)
            if (
              (start <= reservationStart && end >= reservationStart) ||
              (start <= reservationEnd && end >= reservationEnd) ||
              (reservationStart <= start &&
                reservationStart <= end &&
                reservationEnd >= end)
            ) {
              console.log(resMat.amountReserved)
              overMaterial = overMaterial - resMat.amountReserved
              if (overMaterial < 0) {
                isAvailable = false
              }
            }
          }
        }
      }
      if (isAvailable) {
        material.totalAmount = overMaterial
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
        if (reservation.isCancelled) {
          continue
        }
        for (const resroom of reservation.rooms) {
          if (room.id.toString() === resroom.id.toString()) {
            let reservationStart = new Date(date + ' ' + reservation.startTime)
            let reservationEnd = new Date(date + ' ' + reservation.endTime)
            
            if (
              (start <= reservationStart && end >= reservationStart) ||
              (start <= reservationEnd && end >= reservationEnd) ||
              (reservationStart <= start &&
                reservationStart <= end &&
                reservationEnd >= end)
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

  async getReservationsByRoomAndDay(
    date: string,
    roomId: string,
  ): Promise<Reservation[]> {
    const reservations = await this.findByDate(new Date(date))
    const roomReservations: Reservation[] = []
    reservations.forEach(reservation => {
      reservation.rooms.forEach(room => {
        if (room.id.toString() === roomId) {
          roomReservations.push(reservation)
        }
      })
    })
    return roomReservations
  }

  async getReservationsByUser(userId: string) {
    let timedate = new Date().toISOString().substr(0, 10)
    const date = new Date(timedate + 'T00:00:00.000Z')
    const id = userId.toString()
    return (
      await this.reservationRepository.find({
        where: { groupId: id, isCancelled: false },
      })
    )
      .filter(reservation => 
          reservation.date >= date)
      .sort((a, b) => {
        //sort by date
        const timeA = new Date(a.date + ' ' + a.startTime)
        const timeB = new Date(b.date + ' ' + b.startTime)
        if (a.date > b.date) {
          return 1
        }
        if (a.date < b.date) {
          return -1
        }
        //sort by start time
        if (timeA > timeB) {
          return 1
        }
        if (timeA < timeB) {
          return -1
        }
        return 0
    })

  }

  async cancelReservation(id: string) {
    const reservation = await this.findOne(id)
    reservation.isCancelled = true
    return this.reservationRepository.save(reservation)
  }

  // remove(id: string) {
  //   return `This action removes a #${id} reservation`;
  // }
}
