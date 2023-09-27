import { Command } from 'nestjs-command'
import { Injectable } from '@nestjs/common'
import { SeedService } from './seed.service'

@Injectable()
export class DatabaseSeedCommand {
  constructor(private readonly seedService: SeedService) {}

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
  async delete() {
    console.info('🔪 Start deleting groups')
    await this.seedService.deleteAllGroups()
    console.info('🪶 Removed groups')
  }
}
