import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { LoanableMaterialsService } from './loanable-materials.service'
import { LoanableMaterial } from './entities/loanable-material.entity'
import { CreateLoanableMaterialInput } from './dto/create-loanable-material.input'
import { UpdateLoanableMaterialInput } from './dto/update-loanable-material.input'

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

  @Query(() => [LoanableMaterial], {
    name: 'GetAllloanableMaterials',
    nullable: true,
  })
  findAll() {
    return this.loanableMaterialsService.findAll()
  }

  @Query(() => LoanableMaterial, {
    name: 'GetloanableMaterialById',
    nullable: true,
  })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.loanableMaterialsService.findOneById(id)
  }

  @Mutation(() => LoanableMaterial)
  removeLoanableMaterialById(@Args('id', { type: () => String }) id: number) {
    this.loanableMaterialsService.remove(id)
    return 'Deleted loanableMaterial with id: ' + id
  }
}