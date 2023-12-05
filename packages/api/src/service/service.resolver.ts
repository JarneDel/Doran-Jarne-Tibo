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
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from '../authentication/guards/firebase.guard'
import { RolesGuard } from '../authentication/guards/roles.guard'
import { AllowedRoles } from '../authentication/decorators/role.decorator'
import { Role } from '../users/entities/user.entity'
import { FirebaseUser } from '../authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'

@UseGuards(FirebaseGuard, RolesGuard)
@AllowedRoles(Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
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

  @Query(() => [Service], { name: 'services' })
  findAll() {
    return this.serviceService.findAll()
  }

  @Query(() => Service, { name: 'service' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.serviceService.findOne(id)
  }

  @Query(() => [Service], { name: 'servicesByStaff' })
  findByStaffId(@FirebaseUser() user: UserRecord) {
    console.log(user.uid, 'getting services by staff id')
    return this.serviceService.findByStaffUId(user.uid)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @Mutation(() => Service)
  updateService(
    @Args('updateServiceInput') updateServiceInput: UpdateServiceInput,
  ) {
    return this.serviceService.update(updateServiceInput.id, updateServiceInput)
  }

  @Mutation(() => String)
  removeService(@Args('id', { type: () => String }) id: string) {
    return this.serviceService
      .remove(id)
      .then(res => {
        const obj = JSON.parse(JSON.stringify(res))
        if (obj.raw.deletedCount > 0) {
          return 'Deleted service with id: ' + id + ' successfully'
        } else {
          return 'No service with id: ' + id + ' found'
        }
      })
      .catch(err => {
        console.log(err)
        return err
      })
  }

  @ResolveField()
  staff(@Parent() service: Service): Promise<Staff[]> {
    const { staffUID: staffUIDs } = service
    if (!staffUIDs) throw new GraphQLError(`No staffId found ${service}`)
    return this.staffService.findByUIDs(staffUIDs)
  }

  @ResolveField()
  async rooms(@Parent() service: Service): Promise<Room[]> {
    const { roomId: roomIds } = service
    if (!roomIds) throw new GraphQLError(`No roomId found ${service}`)

    return this.roomService.findByIds(roomIds)
  }
}
