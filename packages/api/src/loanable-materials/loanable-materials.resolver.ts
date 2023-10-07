// Common
import { UseGuards } from '@nestjs/common'
// Graphql
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
// Services
import { LoanableMaterialsService } from './loanable-materials.service'
// Entities
import { LoanableMaterial } from './entities/loanable-material.entity'
// Inputs
import { CreateLoanableMaterialInput } from './dto/create-loanable-material.input'
import { UpdateLoanableMaterialInput } from './dto/update-loanable-material.input'
// Auth
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'

@Resolver(() => LoanableMaterial)
export class LoanableMaterialsResolver {
  constructor(
    private readonly loanableMaterialsService: LoanableMaterialsService
  ) {}

  @Mutation(() => LoanableMaterial)
  createLoanableMaterial(
    @Args('createLoanableMaterialInput')
    createLoanableMaterialInput: CreateLoanableMaterialInput
  ) {
    return this.loanableMaterialsService.create(createLoanableMaterialInput)
  }

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
  removeLoanableMaterialById(@Args('id', { type: () => String }) id: number) {
    this.loanableMaterialsService.remove(id)
    return 'Deleted loanableMaterial with id: ' + id
  }
}
