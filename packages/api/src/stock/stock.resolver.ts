import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { StockService } from './stock.service'
import { Stock } from './entities/stock.entity'
import { CreateStockInput } from './dto/create-stock.input'
import { UpdateStockInput } from './dto/update-stock.input'
import { UserRecord } from 'firebase-admin/auth'
import { FirebaseUser } from '../authentication/decorators/user.decorator'
import { Service } from '../service/entities/service.entity'
import { ServiceService } from '../service/service.service'
import { FilterStockArgs } from './args/filter.stock.args'

@Resolver(() => Stock)
export class StockResolver {
  constructor(
    private readonly stockService: StockService,
    private readonly serviceService: ServiceService,
  ) {}

  @Mutation(() => Stock)
  createStock(@Args('createStockInput') createStockInput: CreateStockInput) {
    return this.stockService.create(createStockInput)
  }

  // @UseGuards(FirebaseGuard)
  // @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @Query(() => [Stock], { name: 'stock' })
  findAll(@FirebaseUser() user: UserRecord, @Args() args: FilterStockArgs) {
    console.log(args)
    if (args) {
      return this.stockService.findWithFilter(args)
    }
    return this.stockService.findAll()
  }

  @Query(() => Stock, { name: 'stockItem', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.stockService.findOne(id)
  }

  @Mutation(() => Stock)
  updateStock(@Args('updateStockInput') updateStockInput: UpdateStockInput) {
    return this.stockService.update(updateStockInput.id, updateStockInput)
  }

  @Mutation(() => String)
  removeStock(@Args('id', { type: () => String }) id: string) {
    return this.stockService.remove(id)
  }

  @ResolveField()
  service(@Parent() stock: Stock): Promise<Service> {
    return this.serviceService.findOne(stock.serviceId)
  }
}
