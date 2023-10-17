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
import { GraphQLError } from 'graphql/error'
import { RoomService } from '../room/room.service'
import { Room } from '../room/entities/room.entity'

@Resolver(() => Service)
export class ServiceResolver {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly staffService: StaffService,
    private readonly roomService: RoomService,
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

  @Query(() => Service, { name: 'services' })
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
  staff(@Parent() service: Service): Promise<Staff[]> {
    const { staffId: staffIds } = service
    if (!staffIds) throw new GraphQLError(`No staffId found ${service}`)

    return this.staffService.find(staffIds)
  }

  @ResolveField()
  async rooms(@Parent() service: Service): Promise<Room[]> {
    const { roomId: roomIds } = service
    if (!roomIds) throw new GraphQLError(`No roomId found ${service}`)

    return this.roomService.findByIds(roomIds)
  }
}
