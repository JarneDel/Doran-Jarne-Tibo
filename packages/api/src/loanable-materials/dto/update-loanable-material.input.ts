import { CreateLoanableMaterialInput } from "./create-loanable-material.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateLoanableMaterialInput extends PartialType(
  CreateLoanableMaterialInput
) {
  @Field()
  name: string;

  @Field()
  totalAmount: number;

  @Field()
  wantedAmount: number;

  @Field(() => [String], { nullable: true })
  sports: string[];

  @Field()
  price: number;

  @Field()
  isComplete: boolean;

  @Field({ nullable: true })
  description?: string;
}

