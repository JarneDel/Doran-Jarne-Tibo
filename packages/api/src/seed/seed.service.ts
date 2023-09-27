import { Injectable } from '@nestjs/common'
import { Stock } from '../stock/entities/stock.entity'
import { StockService } from '../stock/stock.service'

const stocks: Stock[] = []

@Injectable()
export class SeedService {
  constructor(private stockService: StockService) {
  }

  async addStockFromJson(): Promise<Stock[]> {
    let outStocks: Stock[] = []
    for (let bird of stocks) {
      const s = new Stock()
      outStocks.push(s)
    }

    return this.stockService.saveAll(outStocks)
  }

  async deleteAllStock(): Promise<void> {
    return this.stockService.truncate()
  }
}
