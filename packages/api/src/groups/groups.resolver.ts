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

@Resolver(() => Group)
export class GroupsResolver {
  constructor(private readonly groupsService: GroupsService) {}

  @Query(() => [Group], { name: 'groups' })
  findAll() {
    return this.groupsService.findAll()
  }

  @Query(() => Group, { name: 'group' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.groupsService.findOne(id)
  }

  @UseGuards(FirebaseGuard)
  @Mutation(() => Group, { description: 'Create a bird using the DTO.' })
  createGroup(
    @Args('createGroupInput') createGroupInput: CreateGroupInput,
    @FirebaseUser() user: UserRecord,
  ): Promise<Group> {
    return this.groupsService.create(user.uid, createGroupInput)
  }

  @Mutation(() => Group, { description: 'adds a score to a group' })
  updateScore(
    @Args('id', { type: () => String }) id: string,
    @Args('amount', { type: () => Int }) amount: number,
  ): Promise<Group> {
    return this.groupsService.updateScore(id, amount)
  }

  @Mutation(() => Group)
  updateGroup(@Args('updateGroupInput') updateGroupInput: UpdateGroupInput) {
    return this.groupsService.update(updateGroupInput._id, updateGroupInput)
  }

  @Mutation(() => Group)
  removeGroup(@Args('id', { type: () => Int }) id: number) {
    return this.groupsService.remove(id)
  }
}
