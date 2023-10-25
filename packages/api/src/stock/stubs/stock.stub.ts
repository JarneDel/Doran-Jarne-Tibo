import { CreateStockInput } from '../dto/create-stock.input'
import { Stock } from '../entities/stock.entity'
import { ObjectId } from 'mongodb'

export const createStockStub = (): CreateStockInput => {
  const stock = new CreateStockInput()
  stock.name = 'test'
  stock.description = 'test'
  stock.idealStock = 1
  stock.amountInStock = 1
  stock.needToOrderMore = false
  stock.serviceId = '6537e4b5de3a65536d475219'
  return stock
}

export const StockStub = () => {
  const stock = new Stock()
  stock.name = 'test'
  stock.description = 'test'
  stock.idealStock = 1
  stock.amountInStock = 1
  stock.needToOrderMore = false
  stock.serviceId = new ObjectId('6537e4b5de3a65536d475219')
  stock.id = new ObjectId('6537e4b5de3a65536d47521c').toString()
  return stock
}
