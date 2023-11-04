import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GroupsService } from './groups.service'
import { Group } from './entities/group.entity'
import { CreateGroupInput } from './dto/create-group.input'
import { UpdateGroupInput } from './dto/update-group.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'
import { AllowedRoles } from 'src/authentication/decorators/role.decorator'
import { Role, User } from 'src/users/entities/user.entity'
import { RolesGuard } from 'src/authentication/guards/roles.guard'

@Resolver(() => Group)
export class GroupsResolver {
  constructor(private readonly groupsService: GroupsService) {}

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Group], { name: 'groups' })
  findAll() {
    return this.groupsService.findAll()
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => Group, { name: 'group' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.groupsService.findOne(id)
  }
  @AllowedRoles(Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => Group, { name: 'groupByUid' })
  findOneByUid(@FirebaseUser() user: UserRecord): Promise<Group> {
    return this.groupsService.findOneByUid(user.uid)
  }

  @UseGuards(FirebaseGuard)
  @Mutation(() => Group, { description: 'makes a group whit uid' })
  createGroup(
    @Args('createGroupInput') createGroupInput: CreateGroupInput,
    @FirebaseUser() user: UserRecord,
  ): Promise<Group> {
    return this.groupsService.create(user.uid, createGroupInput)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Group, { description: 'adds a score to a group' })
  updateScore(
    @Args('id', { type: () => String }) id: string,
    @Args('amount', { type: () => Int }) amount: number,
  ): Promise<Group> {
    return this.groupsService.updateScore(id, amount)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Group)
  updateGroup(@Args('updateGroupInput') updateGroupInput: UpdateGroupInput) {
    return this.groupsService.update(updateGroupInput._id, updateGroupInput)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Group)
  removeGroup(@Args('id', { type: () => Int }) id: number) {
    return this.groupsService.remove(id)
  }

  @Mutation(() => User)
  @UseGuards(FirebaseGuard)
  async updateGroupProfilePictureUrl(
    @Args('profilePictureUrl', { type: () => String })
    profilePictureUrl: string,
    @FirebaseUser() user: UserRecord,
  ) {
    console.log('updateProfilePictureUrl', profilePictureUrl)
    return this.groupsService.updateProfilePictureUrl(
      user.uid,
      profilePictureUrl,
    )
  }
}
