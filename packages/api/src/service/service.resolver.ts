import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { ServiceService } from './service.service'
import { Service } from './entities/service.entity'
import { CreateServiceInput } from './dto/create-service.input'
import { UpdateServiceInput } from './dto/update-service.input'
import { Staff } from '../staff/entities/staff.entity'
import { StaffService } from '../staff/staff.service'

@Resolver(() => Service)
export class ServiceResolver {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly staffService: StaffService,
  ) {}

  @Mutation(() => Service)
  createService(
    @Args('createServiceInput') createServiceInput: CreateServiceInput,
  ) {
    return this.serviceService.create(createServiceInput)
  }

  @Query(() => [Service], { name: 'service' })
  findAll() {
    return this.serviceService.findAll()
  }

  @Query(() => Service, { name: 'service' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.serviceService.findOne(id)
  }

  @Mutation(() => Service)
  updateService(
    @Args('updateServiceInput') updateServiceInput: UpdateServiceInput,
  ) {
    return this.serviceService.update(updateServiceInput.id, updateServiceInput)
  }

  @Mutation(() => Service)
  removeService(@Args('id', { type: () => String }) id: string) {
    return this.serviceService.remove(id)
  }

  @ResolveField()
  staff(@Parent() service: Service): Promise<Staff> {
    return this.staffService.findOne(service.staffId.toString())
  }
}
