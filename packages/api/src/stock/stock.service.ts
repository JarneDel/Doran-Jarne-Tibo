import { Injectable } from '@nestjs/common'
import { CreateStockInput } from './dto/create-stock.input'
import { UpdateStockInput } from './dto/update-stock.input'
import { Stock } from './entities/stock.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { ServiceService } from '../service/service.service'
import { GraphQLError } from 'graphql/error'
import { FilterStockArgs } from './args/filter.stock.args'

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: MongoRepository<Stock>,
    private readonly serviceService: ServiceService,
  ) {}

  async create(createStockInput: CreateStockInput) {
    const s = new Stock()
    const {
      name,
      serviceId,
      description,
      idealStock,
      amountInStock,
      needToOrderMore,
    } = createStockInput
    // check if service exists
    const service = await this.serviceService.findOne(serviceId)
    if (!service) throw new GraphQLError(`Service ${serviceId} not found}`)

    s.name = name
    s.description = description
    s.idealStock = idealStock
    s.amountInStock = amountInStock
    s.needToOrderMore = needToOrderMore
    s.serviceId = new ObjectId(serviceId)

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
  saveAll(stockItems: Stock[]): Promise<Stock[]> {
    return this.stockRepository.save(stockItems)
  }

  truncate(): Promise<void> {
    return this.stockRepository.clear()
  }

  findWithFilter(args: FilterStockArgs): Promise<Stock[]> {
    const { orderDirection, orderByField, searchName } = args

    const options: FindManyOptions<Stock> = {}
    if (orderDirection && orderByField) {
      const validateOrderFields = ['name', 'amountInStock', 'idealStock']
      if (!validateOrderFields.includes(orderByField)) {
        throw new GraphQLError(`Invalid orderByField ${orderByField} for Stock`)
      }
      options.order = {
        [orderByField]: orderDirection,
      }
    }
    if (searchName) {
      options.where = {
        name: {
          // @ts-ignore
          $regex: searchName,
          $options: 'i',
        },
      }
    }
    console.log('options', options)

    return this.stockRepository.find({
      ...options,
    })
  }
}
