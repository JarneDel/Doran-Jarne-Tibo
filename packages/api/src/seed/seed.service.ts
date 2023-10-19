// external
import { Injectable } from '@nestjs/common'
import { ObjectId } from 'mongodb'

// entities
import { Stock } from '../stock/entities/stock.entity'
import { Group } from 'src/groups/entities/group.entity'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Room } from 'src/room/entities/room.entity'
import { Sport } from 'src/sport/entities/sport.entity'
import { Staff } from '../staff/entities/staff.entity'
import { Service } from '../service/entities/service.entity'

// json: set  "resolveJsonModule": true in tsconfig.json
import * as stock from './data/stock.json'
import * as groups from './data/groups.json'
import * as loanableMaterials from './data/loanableMaterials.json'
import * as rooms from './data/rooms.json'
import * as sports from './data/sports.json'
import * as staff from './data/staff.json'
import * as services from './data/services.json'
import * as reservations from './data/reservations.json'
import * as repairRequests from './data/repairRequests.json'

// services
import { StockService } from '../stock/stock.service'
import { GroupsService } from 'src/groups/groups.service'
import { LoanableMaterialsService } from 'src/loanable-materials/loanable-materials.service'
import { RoomService } from 'src/room/room.service'
import { SportService } from 'src/sport/sport.service'
import { StaffService } from 'src/staff/staff.service'
import { ServiceService } from '../service/service.service'
import { RepairRequestService } from '../repair-request/repair-request.service'
import { Role } from 'src/users/entities/user.entity'
import { Reservation } from 'src/reservation/entities/reservation.entity'
import { ReservationService } from 'src/reservation/reservation.service'
import { Materials } from 'src/reservation/entities/material.entity'
import { Rooms } from 'src/reservation/entities/room.entity'
import { RepairRequest } from 'src/repair-request/entities/repair-request.entity'

@Injectable()
export class SeedService {
  constructor(
    private stockService: StockService,
    private groupsService: GroupsService,
    private loanableMaterialsService: LoanableMaterialsService,
    private roomService: RoomService,
    private sportService: SportService,
    private staffService: StaffService,
    private serviceService: ServiceService,
    private reservationService: ReservationService,
    private RepairRequestService: RepairRequestService
  ) {}

  async addStockFromJson(): Promise<Stock[]> {
    let outStocks: Stock[] = []

    const services = await this.serviceService.findAll()
    if (services.length === 0) {
      console.log('No services found, proceeding without them')
    }
    for (let stockItem of stock) {
      const s = new Stock()
      const {
        name,
        description,
        idealStock,
        amountInStock,
        needToOrderMore,
      } = stockItem

      const service = services[Math.floor(Math.random() * services.length)]
      s.serviceId = new ObjectId(service.id)

      s.name = name
      s.description = description
      s.idealStock = idealStock
      s.amountInStock = amountInStock
      s.needToOrderMore = (needToOrderMore as unknown) as boolean
      outStocks.push(s)
    }

    return await this.stockService.saveAll(outStocks)
  }

  async deleteAllStock(): Promise<void> {
    return this.stockService.truncate()
  }

  async addGroupsFromJson(): Promise<Group[]> {
    let theGroups: Group[] = []
    for (let group of groups) {
      const g = new Group()
      g.name = group.name
      g.btw_number = group.btw_number
      g.score = group.score
      g.locale = group.locale
      g.UID = group.uid
      g.role = Role.GROUP

      theGroups.push(g)
    }

    return this.groupsService.save(theGroups)
  }

  async deleteAllGroups(): Promise<void> {
    return this.groupsService.truncate()
  }

  async deleteAllLoanableMaterials(): Promise<void> {
    return this.loanableMaterialsService.truncate()
  }

  async addLoanableMaterialsFromJson(): Promise<LoanableMaterial[]> {
    const sports = await this.sportService.findAll()
    let LoanableMaterials: LoanableMaterial[] = []
    for (let loanableMaterial of loanableMaterials) {
      const lm = new LoanableMaterial()
      lm.name = loanableMaterial.name
      lm.totalAmount = loanableMaterial.totalAmount
      lm.wantedAmount = loanableMaterial.wantedAmount
      lm.price = loanableMaterial.price
      lm.isComplete = loanableMaterial.isComplete
      lm.description = loanableMaterial.description
      const sport = sports[Math.floor(Math.random() * sports.length)]
      lm.SportId = [new ObjectId(sport.id).toString()]

      LoanableMaterials.push(lm)
    }
    return this.loanableMaterialsService.save(LoanableMaterials)
  }

  async addRoomsFromJson(): Promise<Room[]> {
    const sports = await this.sportService.findAll()
    let Rooms: Room[] = []
    for (let room of rooms) {
      const r = new Room()
      const sport = sports[Math.floor(Math.random() * sports.length)]
      r.name = room.name
      r.pricePerHour = room.pricePerHour
      r.SportId = [new ObjectId(sport.id).toString()]
      r.type = room.type
      Rooms.push(r)
    }

    return this.roomService.save(Rooms)
  }

  async deleteAllRooms(): Promise<void> {
    return this.roomService.truncate()
  }

  async addSportsFromJson(): Promise<Sport[]> {
    let Sports: Sport[] = []
    for (let sport of sports) {
      const s = new Room()
      s.name = sport.name
      Sports.push(s)
    }

    return this.sportService.save(Sports)
  }

  async deleteAllSports(): Promise<void> {
    return this.sportService.truncate()
  }

  async addStaffFromJson(): Promise<Staff[]> {
    let outStaff: Staff[] = []
    for (let staffMember of staff) {
      const s = new Staff()
      s.email = staffMember.email
      s.firstName = staffMember.firstName
      s.lastName = staffMember.lastName
      s.phone = staffMember.phone
      s.holidaysLeft = staffMember.holidaysLeft
      s.holidayDates = staffMember.holidayDates.map((date) => new Date(date))

      outStaff.push(s)
    }

    return this.staffService.saveAll(outStaff)
  }

  async deleteAllStaff(): Promise<void> {
    return this.staffService.truncate()
  }

  async addReservationsFromJson(): Promise<Reservation[]> {
    const groups = await this.groupsService.findAll()
    if (groups.length === 0) {
      throw new Error('No groups found, please seed groups first')
    }
    const rooms = await this.roomService.findAll()
    if (rooms.length === 0) {
      throw new Error('No rooms found, please seed rooms first')
    }
    const loanableMaterials = await this.loanableMaterialsService.findAll()
    if (loanableMaterials.length === 0) {
      throw new Error(
        'No loanable materials found, please seed loanable materials first'
      )
    }

    let outReservations: Reservation[] = []
    for (let reservation of reservations) {
      const r = new Reservation()
      r.date = new Date(reservation.date)
      r.start_time = reservation.start_time
      r.end_time = reservation.end_time
      r.groupId = groups[Math.floor(Math.random() * groups.length)].id
      const materials: Materials[] = []
      for (let material of reservation.reserved_materials) {
        const m = new Materials()
        m.name = material.name
        m.totalAmount = material.totalAmount
        m.wantedAmount = material.wantedAmount
        m.price = material.price
        m.sports = material.sports
        m.isComplete = material.isComplete
        m.description = material.description
        materials.push(m)
      }
      const rooms: Rooms[] = []
      for (let room of reservation.rooms) {
        const r = new Rooms()
        r.name = room.name
        r.pricePerHour = room.pricePerHour
        r.sports = room.sports
        r.type = room.type
        rooms.push(r)
      }
      //@ts-ignore
      r.reserved_materials = materials
      //@ts-ignore
      r.rooms = rooms
      r.price = reservation.price
      r.isCancelled = reservation.isCancelled
      outReservations.push(r)
    }
    return this.reservationService.saveAll(outReservations)
  }

  async deleteAllReservations(): Promise<void> {
    return this.reservationService.truncate()
  }

  async addServicesFromJson(): Promise<Service[]> {
    const staff = await this.staffService.findAll()
    if (staff.length === 0) {
      throw new Error('No staff found, please seed staff first')
    }
    const rooms = await this.roomService.findAll()
    if (rooms.length === 0) {
      throw new Error('No rooms found, please seed rooms first')
    }
    let outServices: Service[] = []
    for (let service of services) {
      const s = new Service()
      s.name = service.name
      s.description = service.description
      s.roomId = [
        new ObjectId(
          rooms[Math.floor(Math.random() * rooms.length)].id
        ).toString(),
      ]
      s.staffId = [
        new ObjectId(
          staff[Math.floor(Math.random() * staff.length)].id
        ).toString(),
      ]
      outServices.push(s)
    }
    return this.serviceService.saveAll(outServices)
  }

  async deleteAllServices(): Promise<void> {
    return this.serviceService.truncate()
  }

  async addRepairRequestsFromJson(): Promise<RepairRequest[]> {
    const outrepairRequests: RepairRequest[] = []

    const rooms = await this.roomService.findAll()
    const loanableMaterials = await this.loanableMaterialsService.findAll()
    const groups = await this.groupsService.findAll()
    const staff = await this.staffService.findAll()

    for (let repairRequest of repairRequests) {
      const rr = new RepairRequest()
      rr.description = repairRequest.description
      rr.isRepaired = false

      const randNumb1 = Math.floor(Math.random() * 2)
      if(randNumb1 === 0) {
        //Room
        const room = await rooms[Math.floor(Math.random() * rooms.length)]
        const specialRoom: Rooms = new Rooms()
        specialRoom.name = room.name
        specialRoom.pricePerHour = room.pricePerHour
        // specialRoom.sports = room.sports.map((sport) => sport.name)
        specialRoom.sports = ["sport1", "sport2"]
        specialRoom.type = room.type
        rr.room = specialRoom
      } else {
        //LoanableMaterial
        const loanableMaterial = await loanableMaterials[Math.floor(Math.random() * loanableMaterials.length)]
        const material = new Materials()
        material.name = loanableMaterial.name
        material.totalAmount = loanableMaterial.totalAmount
        material.wantedAmount = loanableMaterial.wantedAmount
        material.price = loanableMaterial.price
        // material.sports = loanableMaterial.sports.map((sport) => sport.name)
        material.sports = ["sport1", "sport2"]
        material.isComplete = loanableMaterial.isComplete
        material.description = loanableMaterial.description
        rr.loanableMaterial = material
      }

      const randNumb2 = Math.floor(Math.random() * 2)
      if(randNumb2 === 0) {
        //Group
        rr.requestUserId = await groups[Math.floor(Math.random() * groups.length)].UID
      } else {
        //Staff
        rr.requestUserId = await staff[Math.floor(Math.random() * staff.length)].UID
      }

      console.log(rr)
      outrepairRequests.push(rr)
    }
    return this.RepairRequestService.saveAll(outrepairRequests)
  }

  async deleteAllRepairRequests(): Promise<void> {
    return this.RepairRequestService.truncate()
  }
}
