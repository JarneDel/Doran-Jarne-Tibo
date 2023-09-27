import { Module } from '@nestjs/common'
import { StockModule } from '../stock/stock.module'
import { CommandModule } from 'nestjs-command'
import { SeedService } from './seed.service'
import { GroupsModule } from 'src/groups/groups.module'
import { DatabaseSeedCommand } from './seed.command'



@Module({
  providers: [DatabaseSeedCommand, SeedService],
  imports: [StockModule,GroupsModule , CommandModule],
})
export class SeedModule {
}
