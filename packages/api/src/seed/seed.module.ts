import { Module } from '@nestjs/common'
import { StockModule } from '../stock/stock.module'
import { CommandModule } from 'nestjs-command'
import { SeedService } from './seed.service'
import { GroupsModule } from 'src/groups/groups.module'
import { DatabaseSeedCommand } from './seed.command'
import { LoanableMaterialsModule } from 'src/loanable-materials/loanable-materials.module'
import { StaffModule } from '../staff/staff.module'

@Module({
  imports: [
    CommandModule,
    GroupsModule,
    LoanableMaterialsModule,
    StockModule,
    StaffModule,
  ],
  providers: [DatabaseSeedCommand, SeedService],
})
export class SeedModule {}
