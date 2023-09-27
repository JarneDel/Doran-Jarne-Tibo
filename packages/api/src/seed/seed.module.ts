import { Module } from '@nestjs/common'
import { StockModule } from '../stock/stock.module'
import { CommandModule } from 'nestjs-command'
import { SeedService } from './seed.service';

@Module({
  providers: [SeedService]
})
export class SeedModule {
  imports: [StockModule, CommandModule]
}
