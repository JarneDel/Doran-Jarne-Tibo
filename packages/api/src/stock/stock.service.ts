import { Injectable } from '@nestjs/common'
import { CreateStockInput } from './dto/create-stock.input'
import { UpdateStockInput } from './dto/update-stock.input'
import { Stock } from './entities/stock.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ObjectId } from 'mongodb'

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {
  }

  create(createStockInput: CreateStockInput) {
    const s = new Stock()
    const { name, service, description, idealStock, amountInStock, needToOrderMore } = createStockInput
    s.name = name
    s.service = service
    s.description = description
    s.idealStock = idealStock
    s.amountInStock = amountInStock
    s.needToOrderMore = needToOrderMore
    return this.stockRepository.save(s)
  }

  findAll() {
    return this.stockRepository.find()
  }

  findOne(id: string) {
    console.log('id', id)
    const objectId = new ObjectId(id)
    return this.stockRepository.findOneByOrFail({
      //@ts-ignore
      _id: objectId,
    })
  }


  update(id: string, updateStockInput: UpdateStockInput) {
    return `This action updates a #${id} stock`
  }

  remove(id: number) {
    return `This action removes a #${id} stock`
  }
  // logic for seeding
  saveAll(caregivers: Stock[]): Promise<Stock[]> {
    return this.stockRepository.save(caregivers)
  }

  truncate(): Promise<void> {
    return this.stockRepository.clear()
  }
}
