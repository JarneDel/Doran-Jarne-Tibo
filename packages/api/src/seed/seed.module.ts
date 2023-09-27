import { Module } from '@nestjs/common'
import { CommandModule } from 'nestjs-command'
import { SeedService } from './seed.service'
import { DatabaseSeedCommand } from './seed.command'
import { GroupsModule } from 'src/groups/groups.module'

@Module({
  imports: [GroupsModule, CommandModule],
  providers: [DatabaseSeedCommand, SeedService],
})
export class SeedModule {}
