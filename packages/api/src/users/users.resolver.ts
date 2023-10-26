import { Resolver, Query, Mutation, Args, Int, createUnionType } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { Role, User } from './entities/user.entity'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'
// import { AllowedRoles } from './decorators/role.decorator'
// import { RolesGuard } from './guards/roles.guard'
import { query } from 'express'
import { Group } from 'src/groups/entities/group.entity'
import { Staff } from 'src/staff/entities/staff.entity'
import { GroupsService } from 'src/groups/groups.service'
import { StaffService } from 'src/staff/staff.service'
import { AllowedRoles } from '../authentication/decorators/role.decorator'
import { RolesGuard } from '../authentication/guards/roles.guard'

export const GrSt1 = createUnionType({
  name: 'GrSt1',
  types: () => [Group, Staff] as const,
})

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService,
    private readonly groupservice: GroupsService,
    private readonly StaffService: StaffService,
    ) {}

  @UseGuards(FirebaseGuard)
  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @FirebaseUser() user: UserRecord,
  ) {
    return this.usersService.create(user.uid, createUserInput)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll()
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('String', { type: () => String }) id: string) {
    return this.usersService.findOne(id)
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput)
  }

  @Mutation(() => User)
  removeUser(@Args('String', { type: () => String }) id: string) {
    return this.usersService.remove(id)
  }


  @Query(() =>GrSt1 ,{name:'userByUid'})
  @UseGuards(FirebaseGuard)
  async userByUid(@FirebaseUser() user: UserRecord){
    let returnUser
    console.log("useraanvraag")
    try {
      returnUser=await this.StaffService.findOneByUid(user.uid)
    } catch (error) {
      
      returnUser =await this.groupservice.findOneByUid(user.uid)
    }
    return returnUser
  }
}
