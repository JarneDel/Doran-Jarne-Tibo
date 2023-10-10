import { Command } from 'nestjs-command'
import { Injectable } from '@nestjs/common'
import { SeedService } from './seed.service'

@Injectable()
export class DatabaseSeedCommand {
  constructor(private readonly seedService: SeedService) {}

  @Command({
    command: 'seed:database:all',
    describe: 'Seed the database with stocks',
  })
  async seedAll() {
    //Stocks

    //Groups
    console.info('🌱 Start seeding of groups')
    const groups = await this.seedService.addGroupsFromJson()
    console.info(`${groups.length} groups are added`)
    //LoanableMaterials
    console.info('🌱 Start seeding of loanableMaterials')
    const loanableMaterials =
      await this.seedService.addLoanableMaterialsFromJson()
    console.info(`${loanableMaterials.length} loanableMaterials are added`)
    console.log('🧑🏻‍🤝‍🧑🏼 Started seeding staff')
    const staff = await this.seedService.addStaffFromJson()

    //Rooms
    console.info('🌱 Start seeding of rooms')
    const rooms = await this.seedService.addRoomsFromJson()
    console.info(`${rooms.length} rooms are added`)

    console.log(staff.length, ' staff were added')
    const services = await this.seedService.addServicesFromJson()
    console.info(services.length, 'services were added')

    // stocks have to be after services and rooms because of the foreign key
    console.info('🗃️ Start seeding of stocks')
    const stocks = await this.seedService.addStockFromJson()
    console.info(` ${stocks.length} pieces of stock were added`)
    //Sports
    console.info('⛹️‍♂️ Start seeding of sports')
    const sports = await this.seedService.addSportsFromJson()
    console.info(`${sports.length} sports are added`)
  }

  @Command({
    command: 'seed:reset:all',
    describe: 'Delete all data from the stock table',
  })
  async deleteAll() {
    //Stocks
    console.info('🔪 Start deleting stocks')
    await this.seedService.deleteAllStock()
    console.info('Removed stocks')
    //Groups
    console.info('🔪 Start deleting groups')
    await this.seedService.deleteAllGroups()
    console.info('🪶 Removed groups')
    //LoanableMaterials
    console.info('🔪 Start deleting loanableMaterials')
    await this.seedService.deleteAllBirds()
    console.info('Removed loanableMaterials')
    //Rooms
    console.info('🔪 Start deleting rooms')
    await this.seedService.deleteAllRooms()
    console.info('Removed rooms')
    //Sports
    console.info('🔪 Start deleting sports')
    await this.seedService.deleteAllSports()
    console.info('Removed sports')
    await this.seedService.deleteAllStaff()
    console.log('removed all staff')
    await this.seedService.deleteAllServices()
    console.info('Removed all services')
  }

  //Stocks
  //Add
  @Command({
    command: 'seed:database:stock',
    describe: 'Seed the database with stocks',
  })
  async seedStocks() {
    console.info('🌱 Start seeding of stocks')
    const stocks = await this.seedService.addStockFromJson()
    console.info(` ${stocks.length} pieces of stock were added`)
  }
  //Delete
  @Command({
    command: 'seed:reset:stock',
    describe: 'Delete all data from the stock table',
  })
  async deleteStocks() {
    console.info('🔪 Start deleting stocks')
    await this.seedService.deleteAllStock()
    console.info('🪶 Removed stocks')
  }

  //Groups
  //Add
  @Command({
    command: 'seed:database:groups',
    describe: 'Seed the database with groups',
  })
  async seedGroups() {
    console.info('🌱 Start seeding of groups')
    const groups = await this.seedService.addGroupsFromJson()
    console.info(`${groups.length} groups are added`)
  }
  //Delete
  @Command({
    command: 'seed:reset:groups',
    describe: 'Delete all data from the groups table',
  })
  async deleteGroups() {
    console.info('🔪 Start deleting groups')
    await this.seedService.deleteAllGroups()
    console.info('🪶 Removed groups')
  }

  //LoanableMaterials
  //Add
  @Command({
    command: 'seed:database:loanableMaterials',
    describe: 'Seed the database with loanableMaterials',
  })
  async seedLoanableMaterials() {
    console.info('🌱 Start seeding of loanableMaterials')
    const loanableMaterials =
      await this.seedService.addLoanableMaterialsFromJson()
    console.info(`${loanableMaterials.length} loanableMaterials are added`)
  }
  //Delete
  @Command({
    command: 'seed:reset:loanableMaterials',
    describe: 'Delete all data from the loanableMaterials table',
  })
  async deleteLoanableMaterials() {
    console.info('🔪 Start deleting loanableMaterials')
    await this.seedService.deleteAllBirds()
    console.info('Removed loanableMaterials')
  }

  //Rooms
  //Add
  @Command({
    command: 'seed:database:rooms',
    describe: 'Seed the database with rooms',
  })
  async seedRooms() {
    console.info('🌱 Start seeding of rooms')
    const rooms = await this.seedService.addRoomsFromJson()
    console.info(`${rooms.length} rooms are added`)
  }
  //Delete
  @Command({
    command: 'seed:reset:rooms',
    describe: 'Seed the database with rooms',
  })
  async deleteRooms() {
    console.info('🔪 Start deleting rooms')
    await this.seedService.deleteAllRooms()
    console.info('Removed rooms')
  }

  //Sports
  //Add
  @Command({
    command: 'seed:database:sports',
    describe: 'Seed the database with sports',
  })
  async seedSports() {
    console.info('🌱 Start seeding of sports')
    const sports = await this.seedService.addSportsFromJson()
    console.info(`${sports.length} sports are added`)
  }
  //Delete
  @Command({
    command: 'seed:reset:sports',
    describe: 'Seed the database with sports',
  })
  async deleteSports() {
    console.info('🔪 Start deleting sports')
    await this.seedService.deleteAllSports()
    console.info('Removed sports')
  }

  @Command({
    command: 'seed:database:staff',
    describe: 'Seed the database with staff',
  })
  async seedStaff() {
    console.info('Start seeding of staff')
    const staff = await this.seedService.addStaffFromJson()
    console.info(`${staff.length} staff are added`)
  }

  @Command({
    command: 'seed:reset:staff',
    describe: 'Delete all data from the staff table',
  })
  async deleteStaff() {
    console.info('🔪 Start deleting staff')
    await this.seedService.deleteAllStaff()
    console.info('Removed staff')
  }

  @Command({
    command: 'seed:reset:service',
    describe: 'Delete all data from the service table',
  })
  async deleteServices() {
    console.info('Deleting all services')
    await this.seedService.deleteAllServices()
    console.log('removed services')
  }

  @Command({
    command: 'seed:database:service',
    describe: 'Seed services from json file',
  })
  async seedServices() {
    console.log('About to seed services to database')
    const services = await this.seedService.addServicesFromJson()
    console.info(`added ${services.length} services to the database`)
  }
}
