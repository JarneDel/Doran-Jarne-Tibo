// GraphQL
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
// Services
import { SportService } from './sport.service'
// Inputs
import { CreateSportInput } from './dto/create-sport.input'
import { UpdateSportInput } from './dto/update-sport.input'
// Entities
import { Sport } from './entities/sport.entity'
import { Role } from 'src/users/entities/user.entity'
// Common
import { UseGuards } from '@nestjs/common'
// Auth
import { AllowedRoles } from '../authentication/decorators/role.decorator'
// Guards
import { FirebaseGuard } from '../authentication/guards/firebase.guard'
import { RolesGuard } from 'src/authentication/guards/roles.guard'

@Resolver(() => Sport)
export class SportResolver {
  constructor(private readonly sportService: SportService) {}

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Sport)
  createSport(@Args('createSportInput') createSportInput: CreateSportInput) {
    return this.sportService.create(createSportInput)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Sport], {
    name: 'GetAllSports',
  })
  findAll() {
    return this.sportService.findAll()
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => Sport, {
    name: 'GetSportById',
    nullable: true,
  })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.sportService.findOneById(id)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Sport)
  updateSport(@Args('updateSportInput') updateSportInput: UpdateSportInput) {
    return this.sportService.update(updateSportInput.id, updateSportInput)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => String)
  async removeSportById(@Args('id', { type: () => String }) id: string) {
    return this.sportService
      .remove(id)
      .then(res => {
        const obj = JSON.parse(JSON.stringify(res))
        if (obj.raw.deletedCount > 0) {
          return 'Deleted sport with id: ' + id + ' succesfully'
        } else {
          return 'No sport with id: ' + id + ' found'
        }
      })
      .catch(err => {
        console.log(err)
        return 'Error'
      })
  }
}
