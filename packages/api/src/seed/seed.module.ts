// Common
import { Module } from '@nestjs/common'
// Commands
import { CommandModule } from 'nestjs-command'
import { DatabaseSeedCommand } from './seed.command'
// services
import { SeedService } from './seed.service'
// modules
import { StockModule } from '../stock/stock.module'
import { GroupsModule } from 'src/groups/groups.module'
import { LoanableMaterialsModule } from 'src/loanable-materials/loanable-materials.module'
import { StaffModule } from '../staff/staff.module'
import { ServiceModule } from '../service/service.module'
import { SportModule } from 'src/sport/sport.module'
import { RoomModule } from 'src/room/room.module'



@Module({
  imports: [
    CommandModule,
    GroupsModule,
    LoanableMaterialsModule,
    StockModule,
    StaffModule,
    ServiceModule,
    SportModule,
    SeedModule,
    RoomModule,
  ],
  providers: [DatabaseSeedCommand, SeedService],
})
export class SeedModule {}
