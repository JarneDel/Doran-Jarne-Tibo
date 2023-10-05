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
    console.info('🌱 Start seeding of stocks')
    const stocks = await this.seedService.addStockFromJson()
    console.info(` ${stocks.length} pieces of stock were added`)
    //Groups
    console.info('🌱 Start seeding of groups')
    const groups = await this.seedService.addGroupsFromJson()
    console.info(`${groups.length} groups are added`)
    //LoanableMaterials
    console.info('🌱 Start seeding of loanableMaterials')
    const loanableMaterials = await this.seedService.addLoanableMaterialsFromJson()
    console.info(`${loanableMaterials.length} loanableMaterials are added`)
    //Rooms
    console.info('🌱 Start seeding of rooms')
    const rooms = await this.seedService.addRoomsFromJson()
    console.info(`${rooms.length} rooms are added`)
    //Sports
    console.info('🌱 Start seeding of sports')
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
    const loanableMaterials = await this.seedService.addLoanableMaterialsFromJson()
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
}
