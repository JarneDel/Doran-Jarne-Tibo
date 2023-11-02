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
  ) {
    return this.vacationRequestService.create(createVacationRequestInput)
  }

  @Query(() => [VacationRequest], { name: 'vacationRequest' })
  findAll() {
    return this.vacationRequestService.findAll()
  }

  @Query(() => VacationRequest, { name: 'vacationRequest' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.vacationRequestService.findOne(id)
  }

  @Mutation(() => VacationRequest)
  updateVacationRequest(
    @Args('updateVacationRequestInput')
    updateVacationRequestInput: UpdateVacationRequestInput,
  ) {
    return this.vacationRequestService.update(
      updateVacationRequestInput.id,
      updateVacationRequestInput,
    )
  }

  @Mutation(() => VacationRequest)
  removeVacationRequest(@Args('id', { type: () => Int }) id: number) {
    return this.vacationRequestService.remove(id)
  }

  @ResolveField()
  async staff(@Parent() vacationRequest: VacationRequest): Promise<Staff> {
    return await this.staffService.findOne(vacationRequest.staffId)
  }
}
