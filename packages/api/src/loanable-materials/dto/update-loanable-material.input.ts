import { ObjectIdColumn } from "typeorm";
import { CreateLoanableMaterialInput } from "./create-loanable-material.input";
import { InputType, Field, PartialType, ID } from "@nestjs/graphql";

@InputType()
export class UpdateLoanableMaterialInput extends PartialType(
  CreateLoanableMaterialInput
) {
  @ObjectIdColumn()
  @Field(() => ID)
  _id: string;
  
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

