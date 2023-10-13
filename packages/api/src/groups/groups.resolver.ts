import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GroupsService } from './groups.service'
import { Group } from './entities/group.entity'
import { CreateGroupInput } from './dto/create-group.input'
import { number } from 'yargs'
import { UpdateGroupInput } from './dto/update-group.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'
import { AllowedRoles } from 'src/users/decorators/role.decorator'
import { Role } from 'src/users/entities/user.entity'

@Resolver(() => Group)
export class GroupsResolver {
  constructor(private readonly groupsService: GroupsService) {}

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard)
  @Query(() => [Group], { name: 'groups' })
  findAll() {
    return this.groupsService.findAll()
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard)
  @Query(() => Group, { name: 'group' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.groupsService.findOne(id)
  }

  @UseGuards(FirebaseGuard)
  @Query(() => Group, { name: 'groupByUid' })
  findOneByUid(@FirebaseUser() user: UserRecord): Promise<Group> {
    return this.groupsService.findOneByUid(user.uid)
  }

  @UseGuards(FirebaseGuard)
  @Mutation(() => Group, { description: 'Create a bird using the DTO.' })
  createGroup(
    @Args('createGroupInput') createGroupInput: CreateGroupInput,
    @FirebaseUser() user: UserRecord,
  ): Promise<Group> {
    console.info(user)
    return this.groupsService.create(user.uid, createGroupInput)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
  @UseGuards(FirebaseGuard)
  @Mutation(() => Group, { description: 'adds a score to a group' })
  updateScore(
    @Args('id', { type: () => String }) id: string,
    @Args('amount', { type: () => Int }) amount: number,
  ): Promise<Group> {
    return this.groupsService.updateScore(id, amount)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard)
  @Mutation(() => Group)
  updateGroup(@Args('updateGroupInput') updateGroupInput: UpdateGroupInput) {
    return this.groupsService.update(updateGroupInput._id, updateGroupInput)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard)
  @Mutation(() => Group)
  removeGroup(@Args('id', { type: () => Int }) id: number) {
    return this.groupsService.remove(id)
  }
}
