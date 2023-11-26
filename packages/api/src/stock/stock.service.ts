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
    if (!(await this.isStockItemNameUnique(name)))
      throw new GraphQLError(`item exists`)
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
    const objectId = new ObjectId(id)
    return this.stockRepository.findOneByOrFail({
      //@ts-ignore
      _id: objectId,
    })
  }

  async update(id: string, updateStockInput: UpdateStockInput) {

    const s = await this.stockRepository
      .findOneByOrFail({
        //@ts-ignoregl sta
        _id: new ObjectId(id),
      })
      .catch(e => {
        throw new GraphQLError('Stock item not found')
      })
    s.name = updateStockInput.name
    s.description = updateStockInput.description
    s.idealStock = updateStockInput.idealStock
    s.amountInStock = updateStockInput.amountInStock
    s.needToOrderMore = updateStockInput.needToOrderMore
    s.serviceId = new ObjectId(updateStockInput.serviceId)
    return this.stockRepository.save(s)
  }

  async remove(id: string): Promise<string> {
    console.log('deleting')
    const result = await this.stockRepository.delete(id)
    if (result.affected === 1) {
      console.log('deleted item with id', id)
      return id
    }
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
    this.validateOrder(orderDirection, orderByField, options)
    if (searchName) {
      options.where = {
        name: {
          // @ts-ignore
          $regex: searchName,
          $options: 'i',
        },
      }
    }

    if (args.searchServiceId) {
      options.where = {
        ...options.where,
        serviceId: new ObjectId(args.searchServiceId),
      }
    }

    console.log('options', options)

    options.where = {
      ...options.where,
    }
    return this.stockRepository.find({
      ...options,
    })
  }

  private validateOrder = (
    orderDirection: string,
    orderByField: string,
    options: FindManyOptions<Stock>,
  ) => {
    if (!orderDirection || !orderByField) {
      return
    }

    console.log('setting sorting order', orderDirection, orderByField)

    const validateOrderDirections = ['ASC', 'DESC', 'asc', 'desc']
    if (!validateOrderDirections.includes(orderDirection)) {
      throw new GraphQLError(
        `Invalid orderDirection ${orderDirection} for Stock`,
      )
    }
    const direction = orderDirection as 'ASC' | 'DESC' | 'asc' | 'desc'

    const validateOrderFields = [
      'name',
      'amountInStock',
      'idealStock',
      'service',
    ]
    if (!validateOrderFields.includes(orderByField)) {
      throw new GraphQLError(`Invalid orderByField ${orderByField} for Stock`)
    }

    if (orderByField === 'service') {
      options.order = {
        serviceId: direction,
      }
      return
    }

    options.order = {
      [orderByField]: direction,
    }
  }

  /*
   * Checks if a stock item with the given name already exists
   * @param name The name to check
   * @returns true if the name is unique, false otherwise
   */
  private async isStockItemNameUnique(name: string): Promise<boolean> {
    try {
      const stockItemWithName = await this.stockRepository.find({
        where: {
          name: name,
        },
      })
      return !stockItemWithName || stockItemWithName.length == 0
    } catch (e) {
      return false
    }
  }
}
