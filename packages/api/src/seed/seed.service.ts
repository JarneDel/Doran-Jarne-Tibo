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

// services
import { StockService } from '../stock/stock.service'
import { GroupsService } from 'src/groups/groups.service'
import { LoanableMaterialsService } from 'src/loanable-materials/loanable-materials.service'
import { RoomService } from 'src/room/room.service'
import { SportService } from 'src/sport/sport.service'
import { StaffService } from 'src/staff/staff.service'
import { ServiceService } from '../service/service.service'

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
  ) {}

  async addStockFromJson(): Promise<Stock[]> {
    let outStocks: Stock[] = []

    const services = await this.serviceService.findAll()
    if (services.length === 0) {
      console.log('No services found, proceeding without them')
    }
    for (let stockItem of stock) {
      const s = new Stock()
      const { name, description, idealStock, amountInStock, needToOrderMore } =
        stockItem

      const service = services[Math.floor(Math.random() * services.length)]
      s.serviceId = new ObjectId(service.id)

      s.name = name
      s.description = description
      s.idealStock = idealStock
      s.amountInStock = amountInStock
      s.needToOrderMore = needToOrderMore as unknown as boolean
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
    let LoanableMaterials: LoanableMaterial[] = []
    for (let loanableMaterial of loanableMaterials) {
      const lm = new LoanableMaterial()
      lm.name = loanableMaterial.name
      lm.loanedOut = loanableMaterial.loanedOut
      lm.isComplete = loanableMaterial.isComplete
      lm.totalAmount = loanableMaterial.totalAmount
      lm.description = loanableMaterial.description

      LoanableMaterials.push(lm)
    }
    return this.loanableMaterialsService.save(LoanableMaterials)
  }

  async addRoomsFromJson(): Promise<Room[]> {
    let Rooms: Room[] = []
    for (let room of rooms) {
      const r = new Room()
      r.name = room.name
      r.pricePerHour = room.pricePerHour
      r.sports = room.sports
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
      s.holidayDates = staffMember.holidayDates.map(date => new Date(date))

      outStaff.push(s)
    }

    return this.staffService.saveAll(outStaff)
  }

  async deleteAllStaff(): Promise<void> {
    return this.staffService.truncate()
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
          rooms[Math.floor(Math.random() * rooms.length)].id,
        ).toString(),
      ]
      s.staffId = [
        new ObjectId(
          staff[Math.floor(Math.random() * staff.length)].id,
        ).toString(),
      ]
      outServices.push(s)
    }
    return this.serviceService.saveAll(outServices)
  }

  async deleteAllServices(): Promise<void> {
    return this.serviceService.truncate()
  }
}
