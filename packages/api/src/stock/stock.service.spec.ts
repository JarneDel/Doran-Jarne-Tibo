import { Test, TestingModule } from '@nestjs/testing'
import { StockService } from './stock.service'
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils'
import { Stock } from './entities/stock.entity'
import { Repository } from 'typeorm/repository/Repository'
import { ServiceService } from '../service/service.service'
import { CreateStockInput } from './dto/create-stock.input'
import { createStockStub, StockStub } from './stubs/stock.stub'
import { GraphQLError } from 'graphql/error'

describe('StockService', () => {
  let service: StockService
  let mockStockRepository: Repository<Stock>
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
          },
        },
      ],
    }).compile()

    service = module.get<StockService>(StockService)
    mockStockRepository = module.get<Repository<Stock>>(
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
})
