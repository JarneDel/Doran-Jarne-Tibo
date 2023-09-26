import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LoanableMaterialsService } from './loanable-materials.service';
import { LoanableMaterial } from './entities/loanable-material.entity';
import { CreateLoanableMaterialInput } from './dto/create-loanable-material.input';
import { UpdateLoanableMaterialInput } from './dto/update-loanable-material.input';

@Resolver(() => LoanableMaterial)
export class LoanableMaterialsResolver {
  constructor(private readonly loanableMaterialsService: LoanableMaterialsService) {}

  @Mutation(() => LoanableMaterial)
  createLoanableMaterial(@Args('createLoanableMaterialInput') createLoanableMaterialInput: CreateLoanableMaterialInput) {
    return this.loanableMaterialsService.create(createLoanableMaterialInput);
  }

  @Query(() => [LoanableMaterial], { name: 'loanableMaterials' })
  findAll() {
    return this.loanableMaterialsService.findAll();
  }

  @Query(() => LoanableMaterial, { name: 'loanableMaterial' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.loanableMaterialsService.findOne(id);
  }

  @Query(() => [LoanableMaterial], { name: 'loanableMaterial' })
  getLoanableMaterials() {
    return [
      {
        exampleField: 1,
        id: '1',
        name: 'Example',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }

  @Mutation(() => LoanableMaterial)
  updateLoanableMaterial(@Args('updateLoanableMaterialInput') updateLoanableMaterialInput: UpdateLoanableMaterialInput) {
    return this.loanableMaterialsService.update(updateLoanableMaterialInput.id, updateLoanableMaterialInput);
  }

  @Mutation(() => LoanableMaterial)
  removeLoanableMaterial(@Args('id', { type: () => Int }) id: number) {
    return this.loanableMaterialsService.remove(id);
  }
}
