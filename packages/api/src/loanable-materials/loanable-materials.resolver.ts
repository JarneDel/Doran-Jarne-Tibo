// Common
import { UseGuards } from '@nestjs/common'
// Graphql
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
// Services
import { LoanableMaterialsService } from './loanable-materials.service'
// Entities
import { LoanableMaterial } from './entities/loanable-material.entity'
import { Role } from 'src/users/entities/user.entity'
// Inputs
import { CreateLoanableMaterialInput } from './dto/create-loanable-material.input'
import { UpdateLoanableMaterialInput } from './dto/update-loanable-material.input'
// Auth
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { AllowedRoles } from '../users/decorators/role.decorator'


@Resolver(() => LoanableMaterial)
export class LoanableMaterialsResolver {
  constructor(
    private readonly loanableMaterialsService: LoanableMaterialsService
  ) {}

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(FirebaseGuard)
  @Mutation(() => LoanableMaterial)
  createLoanableMaterial(
    @Args('createLoanableMaterialInput')
    createLoanableMaterialInput: CreateLoanableMaterialInput
  ) {
    return this.loanableMaterialsService.create(createLoanableMaterialInput)
  }

  @AllowedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.STAFF, Role.GROUP)
  @UseGuards(FirebaseGuard)
  @Query(() => [LoanableMaterial], {
    name: 'GetAllloanableMaterials',
    nullable: true,
  })
  findAll() {
    return this.loanableMaterialsService.findAll()
  }

  @UseGuards(FirebaseGuard)
  @Query(() => LoanableMaterial, {
    name: 'GetloanableMaterialById',
    nullable: true,
  })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.loanableMaterialsService.findOneById(id)
  }

  @UseGuards(FirebaseGuard)
  @Mutation(() => LoanableMaterial)
  updateLoanableMaterial(
    @Args('updateLoanableMaterialInput')
    updateLoanableMaterialInput: UpdateLoanableMaterialInput
  ) {
    return this.loanableMaterialsService.update(
      updateLoanableMaterialInput._id,
      updateLoanableMaterialInput
    )
  }

  @Mutation(() => String)
  removeLoanableMaterialById(@Args('id', { type: () => String }) id: string) {
    return this.loanableMaterialsService
      .remove(id)
      .then((res) => {
        const obj = JSON.parse(JSON.stringify(res))
        if (obj.raw.deletedCount > 0) {
          return 'Deleted room with id: ' + id + ' succesfully'
        } else {
          return 'No room with id: ' + id + ' found'
        }
      })
      .catch((err) => {
        console.log(err)
        return 'Error'
      })
  }
}
