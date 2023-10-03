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
    console.info('🗃️ Start seeding of stocks')
    const stocks = await this.seedService.addStockFromJson()
    console.info(` ${stocks.length} pieces of stock were added`)
    //Groups
    console.info('Start seeding of groups')
    const groups = await this.seedService.addGroupsFromJson()
    console.info(`${groups.length} groups are added`)
    //LoanableMaterials
    console.info('Start seeding of loanableMaterials')
    const loanableMaterials = await this.seedService.addLoanableMaterialsFromJson()
    console.info(`${loanableMaterials.length} loanableMaterials are added`)
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
  }

  @Command({
    command: 'seed:database:stock',
    describe: 'Seed the database with stocks',
  })
  async seedStocks() {
    console.info('🗃️ Start seeding of stocks')
    const stocks = await this.seedService.addStockFromJson()
    console.info(` ${stocks.length} pieces of stock were added`)
  }

  @Command({
    command: 'seed:reset:stock',
    describe: 'Delete all data from the stock table',
  })
  async deleteStocks() {
    console.info('🔪 Start deleting stocks')
    await this.seedService.deleteAllStock()
    console.info('🪶 Removed stocks')
  }

  @Command({
    command: 'seed:database:groups',
    describe: 'Seed the database with groups',
  })
  async seedGroups() {
    console.info('Start seeding of groups')
    const groups = await this.seedService.addGroupsFromJson()
    console.info(`${groups.length} groups are added`)
  }

  @Command({
    command: 'seed:reset:groups',
    describe: 'Delete all data from the groups table',
  })
  async deleteGroups() {
    console.info('🔪 Start deleting groups')
    await this.seedService.deleteAllGroups()
    console.info('🪶 Removed groups')
  }

  @Command({
    command: 'seed:database:loanableMaterials',
    describe: 'Seed the database with loanableMaterials',
  })
  async seedLoanableMaterials() {
    console.info('Start seeding of loanableMaterials')
    const loanableMaterials = await this.seedService.addLoanableMaterialsFromJson()
    console.info(`${loanableMaterials.length} loanableMaterials are added`)
  }

  @Command({
    command: 'seed:reset:loanableMaterials',
    describe: 'Delete all data from the loanableMaterials table',
  })
  async deleteLoanableMaterials() {
    console.info('🔪 Start deleting loanableMaterials')
    await this.seedService.deleteAllBirds()
    console.info('Removed loanableMaterials')
  }
}
