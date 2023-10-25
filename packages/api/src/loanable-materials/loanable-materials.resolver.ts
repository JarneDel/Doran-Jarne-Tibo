// Common
import { UseGuards } from '@nestjs/common'
// Graphql
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
// Services
import { LoanableMaterialsService } from './loanable-materials.service'
import { SportService } from 'src/sport/sport.service'
// Entities
import { LoanableMaterial } from './entities/loanable-material.entity'
import { Role } from 'src/users/entities/user.entity'
import { Sport } from 'src/sport/entities/sport.entity'
// Inputs
import { CreateLoanableMaterialInput } from './dto/create-loanable-material.input'
import { UpdateLoanableMaterialInput } from './dto/update-loanable-material.input'
// Auth
import { AllowedRoles } from '../authentication/decorators/role.decorator'
import { GraphQLError } from 'graphql/error'
// Guards
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { RolesGuard } from 'src/authentication/guards/roles.guard'

@Resolver(() => LoanableMaterial)
export class LoanableMaterialsResolver {
  constructor(
    private readonly loanableMaterialsService: LoanableMaterialsService,
    private readonly sportService: SportService,
  ) {}

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => LoanableMaterial)
  createLoanableMaterial(
    @Args('createLoanableMaterialInput')
    createLoanableMaterialInput: CreateLoanableMaterialInput,
  ) {
    return this.loanableMaterialsService.create(createLoanableMaterialInput)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [LoanableMaterial], {
    name: 'GetAllloanableMaterials',
    nullable: true,
  })
  findAll() {
    return this.loanableMaterialsService.findAll()
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => LoanableMaterial, {
    name: 'GetloanableMaterialById',
    nullable: true,
  })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.loanableMaterialsService.findOneById(id)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => LoanableMaterial)
  updateLoanableMaterial(
    @Args('updateLoanableMaterialInput')
    updateLoanableMaterialInput: UpdateLoanableMaterialInput,
  ) {
    return this.loanableMaterialsService.update(
      updateLoanableMaterialInput._id,
      updateLoanableMaterialInput,
    )
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => String)
  removeLoanableMaterialById(@Args('id', { type: () => String }) id: string) {
    return this.loanableMaterialsService
      .remove(id)
      .then(res => {
        const obj = JSON.parse(JSON.stringify(res))
        if (obj.raw.deletedCount > 0) {
          return 'Deleted room with id: ' + id + ' succesfully'
        } else {
          return 'No room with id: ' + id + ' found'
        }
      })
      .catch(err => {
        console.log(err)
        return 'Error'
      })
  }

  @ResolveField() // "sports" must be the same as the field in the LoanableMaterial entity
  async sports(@Parent() loanableMaterial: LoanableMaterial): Promise<Sport[]> {
    const { SportId } = loanableMaterial
    if (!SportId) throw new GraphQLError('No SportId found')
    let sports: Sport[] = []
    for (let id of SportId) {
      const sport = await this.sportService.findOneById(id)
      if (!sport) throw new GraphQLError('No sport found')
      sports.push(sport)
    }
    return sports
  }
}
