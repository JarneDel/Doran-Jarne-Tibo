import {
  Args,
  Field,
  Mutation,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql'
import { VacationRequestService } from './vacation-request.service'
import { VacationRequest } from './entities/vacation-request.entity'
import { CreateVacationRequestInput } from './dto/create-vacation-request.input'
import { Staff } from '../staff/entities/staff.entity'
import { StaffService } from '../staff/staff.service'
import { UseGuards } from '@nestjs/common'
import { RolesGuard } from '../authentication/guards/roles.guard'
import { FirebaseGuard } from '../authentication/guards/firebase.guard'
import { AllowedRoles } from '../authentication/decorators/role.decorator'
import { Role } from '../users/entities/user.entity'
import { FirebaseUser } from '../authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'
import { ApproveVacationRequestInput } from './dto/approve-vacation-request.input'
import { FindVacationArgs } from './args/findVacation.args'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

@Resolver(() => VacationRequest)
export class VacationRequestResolver {
  constructor(
    private readonly vacationRequestService: VacationRequestService,
    private readonly staffService: StaffService,
  ) {}

  @AllowedRoles(Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => VacationRequest)
  createVacationRequest(
    @Args('createVacationRequestInput')
    createVacationRequestInput: CreateVacationRequestInput,
    @FirebaseUser() user: UserRecord,
  ) {
    const request = this.vacationRequestService.create(
      createVacationRequestInput,
      user.uid,
    )

    this.vacationRequestService.pendingCount().then(count => {
      pubSub
        .publish('vacationRequested', {
          vacationRequested: new CountSubscriptionMessage(count),
        })
        .then(() => {
          console.log('published')
        })
    })

    return request
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [VacationRequest], { name: 'vacationRequests' })
  findAll() {
    return this.vacationRequestService.findAll()
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [VacationRequest], { name: 'vacationRequestsBy' })
  findBy(@Args() query: FindVacationArgs) {
    if (query.isExpired && query.isOpen !== null) {
      throw new Error('Cannot combine isOpen and isExpired')
    }
    if (query.isOpen !== null) {
      return this.vacationRequestService.findByIsOpen(query.isOpen)
    }
    if (query.isExpired) {
      return this.vacationRequestService.findExpired()
    }
    return this.vacationRequestService.findAll()
  }

  @UseGuards(FirebaseGuard, RolesGuard)
  @AllowedRoles(Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => VacationRequest, { name: 'vacationRequest' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.vacationRequestService.findOne(id)
  }

  @AllowedRoles(Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [VacationRequest], { name: 'vacationRequestLoggedIn' })
  findByFirebaseUser(@FirebaseUser() user: UserRecord) {
    return this.vacationRequestService.findByStaffUId(user.uid)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [VacationRequest], { name: 'vacationRequestByStaff' })
  findByStaffId(@Args('staffId', { type: () => String }) staffId: string) {
    return this.vacationRequestService.findByStaffUId(staffId)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => VacationRequest)
  async approveVacationRequest(
    @Args('approveVacationRequestInput')
    approveVacationRequestInput: ApproveVacationRequestInput,
  ) {
    const approvedRequest = await this.vacationRequestService.approve(
      approveVacationRequestInput,
    )
    const count = await this.vacationRequestService.pendingCount()
    pubSub
      .publish('vacationRequested', {
        vacationRequested: new CountSubscriptionMessage(count, 'new'),
      })
      .then(() => {
        console.debug('published')
      })
    return approvedRequest
  }

  @AllowedRoles(Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => VacationRequest)
  cancelVacationRequest(
    @Args('id', { type: () => String }) id: string,
    @FirebaseUser() user: UserRecord,
  ) {
    return this.vacationRequestService.cancel(id, user.uid)
  }

  @ResolveField()
  staff(@Parent() vacationRequest: VacationRequest): Promise<Staff> {
    return this.staffService.findOneByUid(vacationRequest.staffUId)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => CountSubscriptionMessage, {
    name: 'pendingVacationRequestsCount',
  })
  async pendingVacationRequestsCount() {
    const count = await this.vacationRequestService.pendingCount()
    return new CountSubscriptionMessage(count)
  }

  //
  @Subscription(() => CountSubscriptionMessage, {
    name: 'vacationRequested',
  })
  vacationRequested() {
    return pubSub.asyncIterator('vacationRequested')
  }
}

@ObjectType()
class CountSubscriptionMessage {
  @Field(() => Number)
  count: number

  @Field(() => String, { nullable: true })
  type?: string

  constructor(count: number, type?: string) {
    this.count = count
    this.type = type
  }
}
