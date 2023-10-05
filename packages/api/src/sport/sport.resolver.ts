// GraphQL
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
// Services
import { SportService } from './sport.service'
// Inputs
import { CreateSportInput } from './dto/create-sport.input'
import { UpdateSportInput } from './dto/update-sport.input'
// Entities
import { Sport } from './entities/sport.entity'
// Firebase
import { FirebaseGuard } from '../authentication/guards/firebase.guard'
import { UserRecord } from 'firebase-admin/auth'
import { FirebaseUser } from '../authentication/decorators/user.decorator'

@Resolver(() => Sport)
export class SportResolver {
  constructor(private readonly sportService: SportService) {}

  @Mutation(() => Sport)
  createSport(@Args('createSportInput') createSportInput: CreateSportInput) {
    return this.sportService.create(createSportInput)
  }

  @Query(() => [Sport], {
    name: 'GetAllSports',
  })
  findAll() {
    return this.sportService.findAll()
  }

  @Query(() => Sport, {
    name: 'GetSportById',
    nullable: true,
  })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.sportService.findOneById(id)
  }

  @Mutation(() => Sport)
  updateSport(@Args('updateSportInput') updateSportInput: UpdateSportInput) {
    return this.sportService.update(updateSportInput.id, updateSportInput)
  }

  @Mutation(() => Sport)
  removeSportById(@Args('id', { type: () => String }) id: string) {
    return this.sportService.remove(id)
  }
}
