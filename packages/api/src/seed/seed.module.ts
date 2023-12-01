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
import { ReservationModule } from 'src/reservation/reservation.module'
import { RepairRequestModule } from 'src/repair-request/repair-request.module'
import { VacationRequestModule } from '../vacation-request/vacation-request.module'
import { StaffRegisterModule } from '../staff-register/staff-register.module'

@Module({
  imports: [
    ReservationModule,
    CommandModule,
    GroupsModule,
    LoanableMaterialsModule,
    StockModule,
    StaffModule,
    ServiceModule,
    SportModule,
    RoomModule,
    ReservationModule,
    RepairRequestModule,
    VacationRequestModule,
    StaffRegisterModule,
  ],
  providers: [DatabaseSeedCommand, SeedService],
})
export class SeedModule {}
