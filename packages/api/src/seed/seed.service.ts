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
import { Role } from 'src/users/entities/user.entity'
import { Reservation } from 'src/reservation/entities/reservation.entity'
import { ReservationService } from 'src/reservation/reservation.service'
import { Materials } from 'src/reservation/entities/material.entity'
import { Rooms } from 'src/reservation/entities/room.entity'
import { RepairRequest } from 'src/repair-request/entities/repair-request.entity'
import { WorkingHoursEntity } from '../staff/entities/workingHours.entity'
import { VacationRequest } from '../vacation-request/entities/vacation-request.entity'

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
import { VacationRequestService } from '../vacation-request/vacation-request.service'
import { Sports } from 'src/reservation/entities/sport.entity'

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
    private RepairRequestService: RepairRequestService,
    private vacationRequestService: VacationRequestService
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
      g.email = group.email
      g.btwNumber = group.btw_number
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
    let LoanableMaterials: LoanableMaterial[] = []
    for (let loanableMaterial of loanableMaterials) {
      const lm = new LoanableMaterial()
      lm.name = loanableMaterial.name
      lm.totalAmount = loanableMaterial.totalAmount
      lm.wantedAmount = loanableMaterial.wantedAmount
      lm.price = loanableMaterial.price
      lm.isComplete = loanableMaterial.isComplete
      lm.description = loanableMaterial.description
      const sports = loanableMaterial.sports
      const sportIds: string[] = []
      for (let sport of sports) {
        const s = await this.sportService.findOneByName(sport)
        sportIds.push(s.id.toString())
      }
      lm.SportId = sportIds
      LoanableMaterials.push(lm)
    }
    return this.loanableMaterialsService.save(LoanableMaterials)
  }

  async addRoomsFromJson(): Promise<Room[]> {
    let Rooms: Room[] = []
    for (let room of rooms) {
      const r = new Room()
      const SportIds = []
      for (let sportName of room.sports) {
        const s = await this.sportService.findOneByName(sportName)
        if (s) SportIds.push(s.id.toString())
        else console.log('Sport not found:' + sportName)
      }
      r.name = room.name
      r.pricePerHour = room.pricePerHour
      r.SportId = SportIds
      r.type = room.type
      r.canBeUsed = room.canBeUsed
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
      const s = new Sport()
      s.name = sport.name
      s.description = sport.description
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
      s.holidaysLeft = staffMember.holidaysleft
      s.holidayDates = staffMember.holidayDates.map((date) => new Date(date))
      s.holidaysTotal = staffMember.holidaysTotal
      const role = staffMember.role
      if (role === 'ADMIN') {
        s.role = Role.ADMIN
      } else if (role === 'STAFF') {
        s.role = Role.STAFF
      } else if (role === 'SUPER_ADMIN') {
        s.role = Role.SUPER_ADMIN
      }
      s.UID = staffMember.UID
      s.locale = staffMember.locale
      s.workingHours = (staffMember.workingHours as unknown) as WorkingHoursEntity[]
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
    const rooms = (await this.roomService.findAll()).filter(
      (room) =>
        room.type === 'Sportzaal' ||
        room.type === 'Kleedkamer' ||
        room.type === 'Zwembad' ||
        room.type === 'Duikput'
    )
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
      r.startTime = reservation.start_time
      r.endTime = reservation.end_time
      r.groupId = groups[
        Math.floor(Math.random() * groups.length)
      ].id.toString()
      const loanableMaterial = await loanableMaterials[
        Math.floor(Math.random() * loanableMaterials.length)
      ]
      const material = new Materials()
      // give the sport a fake first sport so that the push function works
      let sports: Sport[] = []
      for (let sportId of loanableMaterial.SportId) {
        const s = this.sportService.findOneById(sportId)
        s.then((sport) => {
          sports.push(sport)
        })
      }
      material.id = loanableMaterial.id
      material.name = loanableMaterial.name
      material.totalAmount = loanableMaterial.totalAmount
      material.wantedAmount = loanableMaterial.wantedAmount
      material.price = loanableMaterial.price
      material.sports = sports
      material.isComplete = loanableMaterial.isComplete
      material.description = loanableMaterial.description
      material.amountReserved = Math.round(Math.random() * 10)
      const materialList: [Materials] = [material]
      r.reservedMaterials = materialList
      //@ts-ignore
      const renroom = await rooms[Math.floor(Math.random() * rooms.length)]
      const room = new Rooms()
      room.id = renroom.id
      room.name = renroom.name
      room.pricePerHour = renroom.pricePerHour
      for (let sportId of renroom.SportId) {
        const s = this.sportService.findOneById(sportId)
        s.then((sport) => {
          sports.push(sport)
        })
      }
      room.sports = sports
      room.type = renroom.type
      const roomList: [Rooms] = [room]
      r.rooms = roomList
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
      s.staffUID = [staff[0].UID]
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
      rr.title = repairRequest.title
      rr.description = repairRequest.description
      rr.urgency = Math.floor(Math.random() * 3) + 1
      const randNumb = Math.floor(Math.random() * 2)
      if (randNumb === 0) {
        rr.isRepaired = false
      } else {
        rr.isRepaired = true
      }

      const randNumb1 = Math.floor(Math.random() * 3)
      if (randNumb1 === 0) {
        //Room
        rr.loanableMaterial = null // Set to null because it's a room
        const room = rooms[Math.floor(Math.random() * rooms.length)]
        const roomList: Rooms[] = []
        const r = new Rooms()
        r.id = room.id
        r.name = room.name
        r.pricePerHour = room.pricePerHour
        let sports: Sport[] = []
        for (let sportId of room.SportId) {
          const s = this.sportService.findOneById(sportId)
          s.then((sport) => {
            sports.push(sport)
          })
        }
        r.sports = sports
        r.type = room.type
        roomList.push(r)
        rr.room = roomList
      } else if (randNumb1 === 1) {
        //LoanableMaterial
        const numberOfLoanableMaterials = Math.floor(Math.random() * 3) + 1
        rr.room = null // Set to null because it's a loanable material
        const materialList: Materials[] = []
        const materialIds: string[] = []
        for (let i = 0; i < numberOfLoanableMaterials; i++) {
          let loanableMaterial =
            loanableMaterials[
              Math.floor(Math.random() * loanableMaterials.length)
            ]
          // check if the id is already in the list
          // if so, get a new one
          while (materialIds.includes(loanableMaterial.id)) {
            loanableMaterial =
              loanableMaterials[
                Math.floor(Math.random() * loanableMaterials.length)
              ]
          }
          // save id to check if it's already in the list
          materialIds.push(loanableMaterial.id)

          const material = new Materials()
          let sports: Sport[] = []
          for (let sportId of loanableMaterial.SportId) {
            const s = this.sportService.findOneById(sportId)
            s.then((sport) => {
              sports.push(sport)
            })
          }
          material.id = loanableMaterial.id
          material.name = loanableMaterial.name
          material.totalAmount = loanableMaterial.totalAmount
          material.wantedAmount = loanableMaterial.wantedAmount
          material.price = loanableMaterial.price
          material.sports = sports
          material.isComplete = loanableMaterial.isComplete
          material.description = loanableMaterial.description
          materialList.push(material)
        }
        rr.loanableMaterial = materialList
      } else {
        //Room
        const room = rooms[Math.floor(Math.random() * rooms.length)]
        const roomList: Rooms[] = []
        const r = new Rooms()
        r.id = room.id
        r.name = room.name
        r.pricePerHour = room.pricePerHour
        let sports: Sport[] = []
        for (let sportId of room.SportId) {
          const s = this.sportService.findOneById(sportId)
          s.then((sport) => {
            sports.push(sport)
          })
        }
        r.sports = sports
        r.type = room.type
        roomList.push(r)
        rr.room = roomList
        //LoanableMaterial
        const loanableMaterial =
          loanableMaterials[
            Math.floor(Math.random() * loanableMaterials.length)
          ]
        const material = new Materials()
        let sports2: Sport[] = []
        for (let sportId of loanableMaterial.SportId) {
          const s = this.sportService.findOneById(sportId)
          s.then((sport) => {
            sports2.push(sport)
          })
        }
        material.id = loanableMaterial.id
        material.name = loanableMaterial.name
        material.totalAmount = loanableMaterial.totalAmount
        material.wantedAmount = loanableMaterial.wantedAmount
        material.price = loanableMaterial.price
        material.sports = sports2
        material.isComplete = loanableMaterial.isComplete
        material.description = loanableMaterial.description
        const materialList: Materials[] = []
        materialList.push(material)
        rr.loanableMaterial = materialList
      }

      const randNumb2 = Math.floor(Math.random() * 2)
      if (randNumb2 === 0) {
        //Group
        rr.requestUserId = groups[
          Math.floor(Math.random() * groups.length)
        ].id.toString()
      } else {
        //Staff
        rr.requestUserId = staff[
          Math.floor(Math.random() * staff.length)
        ].id.toString()
      }
      outrepairRequests.push(rr)
    }
    return this.RepairRequestService.saveAll(outrepairRequests)
  }

  async deleteAllRepairRequests(): Promise<void> {
    return this.RepairRequestService.truncate()
  }

  // region vacation-request
  /**
   * Add vacation requests to the database
   * @returns the amount of vacation requests added
   */
  async addVacationRequests(): Promise<number> {
    const staff = await this.staffService.findAll()
    if (staff.length === 0) {
      throw new Error('No staff found, please seed staff first')
    }
    console.log('staff found, seeding vacation requests', staff.length)
    for (let staffMember of staff) {
      const v = new VacationRequest()
      v.staffUId = staffMember.UID
      v.startDate = new Date('2024-01-01')
      v.endDate = new Date('2024-01-02')
      await this.vacationRequestService.create(v, staffMember.UID)
    }
    return Promise.resolve(staff.length)
  }

  async deleteAllVacationRequests(): Promise<void> {
    return this.vacationRequestService.truncate()
  }

  // endregion
}
