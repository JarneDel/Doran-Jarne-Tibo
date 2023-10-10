import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StaffService } from './staff.service'
import { CreateStaffInput } from './dto/create-staff.input'
import { UpdateStaffInput } from './dto/update-staff.input'
import { Staff } from './entities/staff.entity'

@Resolver('Staff')
export class StaffResolver {
  constructor(private readonly staffService: StaffService) {}

  @Mutation(() => Staff, { name: 'createStaff' })
  createStaff(@Args('createStaffInput') createStaffInput: CreateStaffInput) {
    return this.staffService.create(createStaffInput)
  }

  @Query(() => [Staff], { name: 'staff' })
  findAllStaff() {
    return this.staffService.findAll()
  }

  @Query(() => Staff, { name: 'staffItem', nullable: true })
  findOne(@Args('id') id: number) {
    return this.staffService.findOne(id)
  }

  @Mutation(() => Staff)
  update(@Args('updateStaffInput') updateStaffInput: UpdateStaffInput) {
    return this.staffService.update(updateStaffInput.id, updateStaffInput)
  }

  @Mutation(() => String, { name: 'removeStaff' })
  remove(@Args('id') id: number) {
    return this.staffService.remove(id)
  }
}
