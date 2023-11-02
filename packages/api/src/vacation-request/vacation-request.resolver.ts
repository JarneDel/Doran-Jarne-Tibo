import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { VacationRequestService } from './vacation-request.service'
import { VacationRequest } from './entities/vacation-request.entity'
import { CreateVacationRequestInput } from './dto/create-vacation-request.input'
import { UpdateVacationRequestInput } from './dto/update-vacation-request.input'
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


@UseGuards(FirebaseGuard, RolesGuard)
@AllowedRoles(Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN)
@Resolver(() => VacationRequest)
export class VacationRequestResolver {
  constructor(
    private readonly vacationRequestService: VacationRequestService,
    private readonly staffService: StaffService,
  ) {}

  @Mutation(() => VacationRequest)
  createVacationRequest(
    @Args('createVacationRequestInput')
    createVacationRequestInput: CreateVacationRequestInput,
    @FirebaseUser() user: UserRecord,
  ) {
    return this.vacationRequestService.create(
      createVacationRequestInput,
      user.uid,
    )
  }

  // @Query(() => [VacationRequest], { name: 'vacationRequest' })
  // findAll() {
  //   return this.vacationRequestService.findAll()
  // }
  //
  @Query(() => VacationRequest, { name: 'vacationRequest' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.vacationRequestService.findOne(id)
  }

  @Query(() => [VacationRequest], { name: 'vacationRequestLoggedIn' })
  findByFirebaseUser(@FirebaseUser() user: UserRecord) {
    return this.vacationRequestService.findByStaffUId(user.uid)
  }

  @Query(() => [VacationRequest], { name: 'vacationRequestByStaff' })
  findByStaffId(@Args('staffId', { type: () => String }) staffId: string) {
    return this.vacationRequestService.findByStaffUId(staffId)
  }

  @Mutation(() => VacationRequest)
  approveVacationRequest(
    @Args('approveVacationRequestInput')
    approveVacationRequestInput: ApproveVacationRequestInput,
  ) {
    return this.vacationRequestService.approve(approveVacationRequestInput)
  }

  // @Mutation(() => VacationRequest)
  // updateVacationRequest(
  //   @Args('updateVacationRequestInput')
  //   updateVacationRequestInput: UpdateVacationRequestInput,
  // ) {
  //   return this.vacationRequestService.update(
  //     updateVacationRequestInput.id,
  //     updateVacationRequestInput,
  //   )
  // }
  //
  // @Mutation(() => VacationRequest)
  // removeVacationRequest(@Args('id', { type: () => Int }) id: number) {
  //   return this.vacationRequestService.remove(id)
  // }

  @ResolveField()
  staff(@Parent() vacationRequest: VacationRequest): Promise<Staff> {
    return this.staffService.findOneByUid(vacationRequest.staffUId)
  }
}
