import { CreateLoanableMaterialInput } from './create-loanable-material.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLoanableMaterialInput extends PartialType(CreateLoanableMaterialInput) {
  @Field(() => Int)
  id: number;
}
