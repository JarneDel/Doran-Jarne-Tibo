// Common
import { Logger, Module } from '@nestjs/common'
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
import { FirebaseUserModule } from '../firebase-user/firebase-user.module'

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
    FirebaseUserModule,
  ],
  providers: [DatabaseSeedCommand, SeedService],
})
export class SeedModule {
  constructor(private readonly seedService: SeedService) {
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      this.seedE2ETestDB().then(r =>
        Logger.log('seeded E2E test db', 'SeedModule'),
      )
    }
  }

  private async seedE2ETestDB() {
    await this.seedService.deleteAllFirebaseUsers()
    await this.seedService.addStaffFromJson()
    await this.seedService.addGroupsFromJson()
    await this.seedService.addFirebaseUsers()
    await this.seedService.addSportsFromJson()
    await this.seedService.addLoanableMaterialsFromJson()
    await this.seedService.addRoomsFromJson()
    await this.seedService.addServicesFromJson()
    await this.seedService.addStockFromJson()
    await this.seedService.addReservationsFromJson()
    await this.seedService.addRepairRequestsFromJson()
  }
}
