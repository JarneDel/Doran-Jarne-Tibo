import { Test, TestingModule } from '@nestjs/testing'
import { StockService } from './stock.service'
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils'
import { Stock } from './entities/stock.entity'
import { ServiceService } from '../service/service.service'
import { CreateStockInput } from './dto/create-stock.input'
import { createStockStub, StockStub, UpdateStockStub } from './stubs/stock.stub'
import { GraphQLError } from 'graphql/error'
import { ObjectId } from 'mongodb'
import { FilterStockArgs } from './args/filter.stock.args'
import { MongoRepository } from 'typeorm'

describe('StockService', () => {
  let service: StockService
  let mockStockRepository: MongoRepository<Stock>
  let mockServiceService: StockService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: ServiceService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 'test',
            }),
          },
        },
        {
          provide: getRepositoryToken(Stock),
          useValue: {
            save: jest.fn().mockResolvedValue(StockStub()),
            find: jest.fn().mockResolvedValue(createStockStub()),
            findOneByOrFail: jest.fn().mockResolvedValue(createStockStub()),
            delete: jest.fn().mockResolvedValue({ result: { affected: 1 } }),
          },
        },
      ],
    }).compile()

    service = module.get<StockService>(StockService)
    mockStockRepository = module.get<MongoRepository<Stock>>(
      getRepositoryToken(Stock),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  describe('create', () => {
    describe('when create is called', () => {
      it('should call stockRepository.save', async () => {
        const stock = new CreateStockInput()
        const saveSpy = jest.spyOn(mockStockRepository, 'save')
        const saveSpy2 = jest
          .spyOn(mockStockRepository, 'find')
          .mockReturnValue(
            new Promise((resolve, reject) => {
              resolve([])
            }),
          )
        await service.create(stock)
        expect(saveSpy).toBeCalledTimes(1)
      })
      it('should fail because item exits', async () => {
        try {
          const stock = new CreateStockInput()
          await service.create(stock)
        } catch (e) {
          expect(e).toEqual(new GraphQLError('item exists'))
        }
      })
      it('does the function return a stock', async () => {
        const stock = new CreateStockInput()
        const saveSpy2 = jest
          .spyOn(mockStockRepository, 'find')
          .mockReturnValue(
            new Promise((resolve, reject) => {
              resolve([])
            }),
          )
        const result = await service.create(stock)
        expect(result).toEqual(StockStub())
      })
    })
  })
  describe('find one', () => {
    it('should call stockRepository.findOne', async () => {
      const findOneSpy = jest.spyOn(mockStockRepository, 'findOneByOrFail')
      await service.findOne('6537e4b4de3a65536d4751fb')
      expect(findOneSpy).toBeCalledTimes(1)
    })
  })
  describe('update', () => {
    it('should find the stock item', async () => {
      const updateStockInput = UpdateStockStub()
      const testId = updateStockInput.id
      await service.update(testId, updateStockInput)

      expect(mockStockRepository.findOneByOrFail).toHaveBeenCalledWith({
        _id: new ObjectId(testId),
      })
    })
    it('should call stockRepository.save', async () => {
      const updateStockInput = UpdateStockStub()
      const testId = updateStockInput.id
      await service.update(testId, updateStockInput)
      expect(mockStockRepository.save).toBeCalledTimes(1)
    })

    it('should RETURN the UPDATED the stock item', async () => {
      const updateStockInput = UpdateStockStub()
      const testId = updateStockInput.id
      const result = await service.update(testId, updateStockInput)
      expect(result).toEqual(StockStub())
    })

    it('should throw an error if the stock item does not exist', async () => {
      const updateStockInput = UpdateStockStub()
      const testId = new ObjectId().toString()
      jest
        .spyOn(mockStockRepository, 'findOneByOrFail')
        .mockRejectedValueOnce(new Error(''))

      await expect(service.update(testId, updateStockInput)).rejects.toThrow(
        'Stock item not found',
      )
    })
  })
  describe('find with filter', () => {
    it('should return stocks based on the provided filter', async () => {
      const filterArgs: FilterStockArgs = {
        orderDirection: 'ASC',
        orderByField: 'name',
      }
      const stock1 = new Stock()
      stock1.name = 'stock1'
      const stock2 = new Stock()
      stock2.name = 'stock2'
      jest
        .spyOn(mockStockRepository, 'find')
        .mockResolvedValueOnce([stock1, stock2])

      const result = await service.findWithFilter(filterArgs)
      expect(result).toEqual([stock1, stock2])
    })
    it('should return an empty array if no stocks match the filter', async () => {
      const filterArgs: FilterStockArgs = {
        searchName: 'test',
      }
      jest.spyOn(mockStockRepository, 'find').mockResolvedValueOnce([])
      const result = await service.findWithFilter(filterArgs)
      expect(result).toEqual([])
    })
  })
  describe('remove stock item', () => {
    it('should call stockRepository.remove', async () => {
      const mockSpy = jest.spyOn(mockStockRepository, 'delete')
      const testId = '6537e4b4de3a65536d4751fb'
      await service.remove(testId)
      expect(mockSpy).toBeCalledTimes(1)
    })
  })
})
