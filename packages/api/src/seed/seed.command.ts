import { Command } from "nestjs-command";
import { Injectable } from "@nestjs/common";
import { SeedService } from "./seed.service";

@Injectable()
export class DatabaseSeedCommand {
  constructor(private readonly seedService: SeedService) {}

  @Command({
    command: 'seed:database:stock',
    describe: 'Seed the database with birds',
  })
  async seedBirds() {
    console.info('🗃️ Start seeding of stock')
    const birds = await this.seedService.addStockFromJson()
    console.info(` ${birds.length} pieces of stock were added`)
  }

  @Command({
    command: 'seed:reset:stock',
    describe: 'Delete all data from the stock table',
  })
  async delete() {
    console.info('🔪 Start deleting birds')
    await this.seedService.deleteAllStock()
    console.info('🪶 Removed birds')
  }


  @Command({
    command: 'seed:database:groups',
    describe: 'Seed the database with groups',
  })
  async seedGroups() {
    console.info('🪺 Start seeding of groups')
    const groups = await this.seedService.addGroupsFromJson()
    console.info(`🐣 ${groups.length} groups are added`)
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
    command: "seed:reset:loanableMaterials",
    describe: "Delete all data from the loanableMaterials table",
  })
  async deleteLoanableMaterials() {
    console.info("🔪 Start deleting loanableMaterials");
    await this.seedService.deleteAllBirds();
    console.info("Removed loanableMaterials");
  }

}
