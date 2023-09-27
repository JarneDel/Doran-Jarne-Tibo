import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StockService } from './stock.service'
import { Stock } from './entities/stock.entity'
import { CreateStockInput } from './dto/create-stock.input'
import { UpdateStockInput } from './dto/update-stock.input'

@Resolver(() => Stock)
export class StockResolver {
  constructor(private readonly stockService: StockService) {}

  @Mutation(() => Stock)
  createStock(@Args('createStockInput') createStockInput: CreateStockInput) {
    return this.stockService.create(createStockInput);
  }

  @Query(() => [Stock], { name: 'stocks' })
  findAll() {
    return this.stockService.findAll();
  }

  @Query(() => Stock, { name: 'stock' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.stockService.findOne(id);
  }

  @Mutation(() => Stock)
  updateStock(@Args('updateStockInput') updateStockInput: UpdateStockInput) {
    return this.stockService.update(updateStockInput.id, updateStockInput);
  }

  @Mutation(() => Stock)
  removeStock(@Args('id', { type: () => Int }) id: number) {
    return this.stockService.remove(id);
  }
}
