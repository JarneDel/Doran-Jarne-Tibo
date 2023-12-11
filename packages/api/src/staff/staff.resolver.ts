import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StaffService } from './staff.service'
import { CreateStaffInput } from './dto/create-staff.input'
import { UpdateStaffInput } from './dto/update-staff.input'
import { Staff } from './entities/staff.entity'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { UserRecord } from 'firebase-admin/auth'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { Role, User } from '../users/entities/user.entity'
import { RolesGuard } from '../authentication/guards/roles.guard'
import { AllowedRoles } from '../authentication/decorators/role.decorator'

@UseGuards(FirebaseGuard)
@Resolver('Staff')
export class StaffResolver {
  constructor(private readonly staffService: StaffService) {}

  @UseGuards(FirebaseGuard)
  @Mutation(() => Staff, { name: 'createStaff' })
  createStaff(
    @Args('createStaffInput') createStaffInput: CreateStaffInput,
    @FirebaseUser() user: UserRecord,
  ): Promise<Staff> {
    return this.staffService.create(user.uid, createStaffInput)
  }

  @Query(() => [Staff], { name: 'staff' })
  findAllStaff() {
    return this.staffService.findAll()
  }

  @Query(() => Staff, { name: 'staffItem', nullable: true })
  findOne(@Args('id') id: string) {
    return this.staffService.findOne(id)
  }

  @Mutation(() => Staff, { name: 'updateStaff' })
  update(@Args('updateStaffInput') updateStaffInput: UpdateStaffInput) {
    return this.staffService.update(updateStaffInput.id, updateStaffInput)
  }

  @Mutation(() => String, { name: 'removeStaff' })
  remove(@Args('id') id: string) {
    return this.staffService.remove(id)
  }

  @UseGuards(FirebaseGuard)
  @Query(() => Staff, { name: 'staffByUid' })
  findOneByUid(@FirebaseUser() user: UserRecord): Promise<Staff> {
    return this.staffService.findOneByUid(user.uid)
  }

  @Mutation(() => User)
  @UseGuards(FirebaseGuard)
  async updateStaffProfilePictureUrl(
    @Args('ProfilePictureUrl', { type: () => String })
    profilePictureUrl: string,
    @FirebaseUser() user: UserRecord,
  ) {
    return this.staffService.updateProfilePictureUrl(
      user.uid,
      profilePictureUrl,
    )
  }

  @Mutation(() => User)
  @UseGuards(FirebaseGuard, RolesGuard)
  @AllowedRoles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateRole(
    @Args('id') id: string,
    @Args('role') role: Role,
    @FirebaseUser() user: UserRecord,
  ) {
    return this.staffService.updateRole(id, role, user.uid)
  }
}
