import { Module } from '@nestjs/common'
import { StockService } from './stock.service'
import { StockResolver } from './stock.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Stock } from './entities/stock.entity'
import { ServiceModule } from '../service/service.module'

@Module({
  imports: [TypeOrmModule.forFeature([Stock]), ServiceModule],
  providers: [StockResolver, StockService],
  exports: [StockService],
})
export class StockModule {}
