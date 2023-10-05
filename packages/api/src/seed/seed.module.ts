// Common
import { Module } from '@nestjs/common'
// Commands
import { CommandModule } from 'nestjs-command'
import { DatabaseSeedCommand } from './seed.command'
// Services
import { SeedService } from './seed.service'
// Modules
import { StockModule } from '../stock/stock.module'
import { RoomModule } from 'src/room/room.module'
import { GroupsModule } from 'src/groups/groups.module'
import { LoanableMaterialsModule } from 'src/loanable-materials/loanable-materials.module'
import { SportModule } from 'src/sport/sport.module'


@Module({
  providers: [DatabaseSeedCommand, SeedService],
  imports: [StockModule, GroupsModule, LoanableMaterialsModule, CommandModule, RoomModule, SportModule],
})
export class SeedModule {
}
