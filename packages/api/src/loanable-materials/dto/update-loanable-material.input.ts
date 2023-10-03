import { CreateLoanableMaterialInput } from "./create-loanable-material.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateLoanableMaterialInput extends PartialType(
  CreateLoanableMaterialInput
) {
  @Field()
  name: string;

  @Field()
  loanedOut: boolean;

  @Field()
  totalAmount: number;

  @Field()
  isComplete: boolean;

  @Field({ nullable: true })
  description?: string;

  // @Field({ nullable: true })
  // materialInSet?: Array<JSON>;
}
