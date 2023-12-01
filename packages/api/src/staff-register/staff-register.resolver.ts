import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { StaffRegisterService } from './staff-register.service'
import { UseGuards } from '@nestjs/common'
import { Role } from '../users/entities/user.entity'
import { AllowedRoles } from '../authentication/decorators/role.decorator'
import { CreateStaffRegisterInput } from './dto/create-staff-register.input'

@Resolver()
@UseGuards()
@AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
export class StaffRegisterResolver {
  constructor(private readonly staffRegisterService: StaffRegisterService) {}

  @Mutation(() => Boolean)
  async createStaffRegister(
    @Args('createStaffRegisterInput')
    createStaffRegisterInput: CreateStaffRegisterInput,
  ) {
    return true
  }
}
