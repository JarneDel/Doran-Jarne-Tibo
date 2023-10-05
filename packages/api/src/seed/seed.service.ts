// Nestjs
import { Injectable } from '@nestjs/common'
// Entity's
import { Stock } from '../stock/entities/stock.entity'
import { Room } from 'src/room/entities/room.entity'
import { Group } from 'src/groups/entities/group.entity'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Sport } from 'src/sport/entities/sport.entity'
// Services
import { StockService } from '../stock/stock.service'
import { RoomService } from 'src/room/room.service'
import { GroupsService } from 'src/groups/groups.service'
import { LoanableMaterialsService } from 'src/loanable-materials/loanable-materials.service'
import { SportService } from 'src/sport/sport.service'
// Example data
import * as stock from './data/stock.json' // set  "resolveJsonModule": true in tsconfig.json
import * as groups from './data/groups.json'
import * as loanableMaterials from './data/loanableMaterials.json'
import * as rooms from './data/rooms.json'
import * as sports from './data/sports.json'

@Injectable()
export class SeedService {
  constructor(
    private stockService: StockService,
    private groupsService: GroupsService,
    private loanableMaterialsService: LoanableMaterialsService,
    private roomService: RoomService,
    private sportService: SportService
  ) {}

  async addStockFromJson(): Promise<Stock[]> {
    let outStocks: Stock[] = []
    for (let stockItem of stock) {
      const s = new Stock()
      const {
        name,
        service,
        description,
        idealStock,
        amountInStock,
        needToOrderMore,
      } = stockItem
      s.name = name
      s.service = service
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

      theGroups.push(g)
    }

    return this.groupsService.save(theGroups)
  }

  async deleteAllGroups(): Promise<void> {
    return this.groupsService.truncate()
  }

  async deleteAllBirds(): Promise<void> {
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
}
