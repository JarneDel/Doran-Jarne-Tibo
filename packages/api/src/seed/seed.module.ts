import { Module } from '@nestjs/common'
import { StockModule } from '../stock/stock.module'
import { RoomModule } from 'src/room/room.module'
import { CommandModule } from 'nestjs-command'
import { SeedService } from './seed.service'
import { GroupsModule } from 'src/groups/groups.module'
import { DatabaseSeedCommand } from './seed.command'
import { LoanableMaterialsModule } from 'src/loanable-materials/loanable-materials.module'


@Module({
  providers: [DatabaseSeedCommand, SeedService],
  imports: [StockModule, GroupsModule, LoanableMaterialsModule, CommandModule, RoomModule],
})
export class SeedModule {
}
