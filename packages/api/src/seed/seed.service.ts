import { Injectable } from '@nestjs/common'
import { Stock } from '../stock/entities/stock.entity'
import { StockService } from '../stock/stock.service'
import * as stock from './data/stock.json'
import * as groups from './data/groups.json' // set  "resolveJsonModule": true in tsconfig.json
import * as loanableMaterials from './data/loanableMaterials.json'
import * as staff from './data/staff.json'
import * as services from './data/services.json'
import { Group } from 'src/groups/entities/group.entity'
import { GroupsService } from 'src/groups/groups.service'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { LoanableMaterialsService } from 'src/loanable-materials/loanable-materials.service'
import { Staff } from 'src/staff/entities/staff.entity'
import { StaffService } from 'src/staff/staff.service'
import { ObjectId } from 'mongodb'
import { Service } from '../service/entities/service.entity'
import { ServiceService } from '../service/service.service'

@Injectable()
export class SeedService {
  constructor(
    private stockService: StockService,
    private groupsService: GroupsService,
    private loanableMaterialsService: LoanableMaterialsService,
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

    let outServices: Service[] = []
    for (let service of services) {
      const s = new Service()
      s.name = service.name
      s.description = service.description
      s.staffId = staff[Math.floor(Math.random() * staff.length)].id
      outServices.push(s)
    }
    return this.serviceService.saveAll(outServices)
  }

  async deleteAllServices(): Promise<void> {
    return this.serviceService.truncate()
  }
}
