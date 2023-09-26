import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { LoanableMaterialsService } from "./loanable-materials.service";
import { LoanableMaterial } from "./entities/loanable-material.entity";
import { CreateLoanableMaterialInput } from "./dto/create-loanable-material.input";
import { UpdateLoanableMaterialInput } from "./dto/update-loanable-material.input";

@Resolver(() => LoanableMaterial)
export class LoanableMaterialsResolver {
  constructor(
    private readonly loanableMaterialsService: LoanableMaterialsService
  ) {}

  @Mutation(() => LoanableMaterial)
  createLoanableMaterial(
    @Args("createLoanableMaterialInput")
    createLoanableMaterialInput: CreateLoanableMaterialInput
  ) {
    return this.loanableMaterialsService.create(createLoanableMaterialInput);
  }

  @Query(() => [LoanableMaterial], { name: "GetAllloanableMaterials" })
  findAll() {
    return this.loanableMaterialsService.findAll();
  }

  @Query(() => LoanableMaterial, { name: "GetloanableMaterialById" })
  findOne(@Args("id", { type: () => String }) id: string) {
    return this.loanableMaterialsService.findOne(id);
  }

  @Mutation(() => LoanableMaterial, { name: "UpdateLoanableMaterial" })
  updateLoanableMaterial(
    id: string,
    @Args("updateLoanableMaterialInput")
    updateLoanableMaterialInput: UpdateLoanableMaterialInput
  ) {
    return this.loanableMaterialsService.update(
      id,
      updateLoanableMaterialInput
    );
  }

  @Mutation(() => LoanableMaterial)
  removeLoanableMaterial(@Args("id", { type: () => String }) id: number) {
    return this.loanableMaterialsService.remove(id);
  }
}
