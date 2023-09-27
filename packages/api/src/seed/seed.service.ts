import { Injectable } from '@nestjs/common'
import { Stock } from '../stock/entities/stock.entity'
import { StockService } from '../stock/stock.service'
import * as stock from './data/stock.json'

@Injectable()
export class SeedService {
  constructor(private stockService: StockService) {
  }

  async addStockFromJson(): Promise<Stock[]> {
    let outStocks: Stock[] = []
    for (let stockItem of stock) {
      const s = new Stock()
      const { name, service, description, idealStock, amountInStock, needToOrderMore } = stockItem
      s.name = name
      s.service = service
      s.description = description
      s.idealStock = idealStock
      s.amountInStock = amountInStock
      s.needToOrderMore = needToOrderMore as unknown as boolean
      outStocks.push(s)
    }

    return this.stockService.saveAll(outStocks)
  }

  async deleteAllStock(): Promise<void> {
    return this.stockService.truncate()
  }
}
