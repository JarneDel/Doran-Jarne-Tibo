import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GroupsService } from './groups.service'
import { Group } from './entities/group.entity'
import { CreateGroupInput } from './dto/create-group.input'

@Resolver(() => Group)
export class GroupsResolver {
  constructor(private readonly groupsService: GroupsService) {}

  // @Mutation(() => Group)
  // createGroup(@Args('createGroupInput') createGroupInput: CreateGroupInput) {
  //   return this.groupsService.create(createGroupInput)
  // }

  // @Query(() => [Group], { name: 'birds' })
  // getGroups() {
  //   return []
  // }

  @Query(() => [Group], { name: 'groups' })
  findAll() {
    return this.groupsService.findAll()
  }

  @Query(() => Group, { name: 'group' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.groupsService.findOne(id)
  }

  @Mutation(() => Group, { description: 'Create a bird using the DTO.' })
  createGroup(
    @Args('createGroupInput') createGroupInput: CreateGroupInput,
  ): Promise<Group> {
    return this.groupsService.create(createGroupInput)
  }

  // @Mutation(() => Group)
  // updateGroup(@Args('updateGroupInput') updateGroupInput: UpdateGroupInput) {
  //   return this.groupsService.update(updateGroupInput.id, updateGroupInput)
  // }

  @Mutation(() => Group)
  removeGroup(@Args('id', { type: () => Int }) id: number) {
    return this.groupsService.remove(id)
  }
}
