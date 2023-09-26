import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateLoanableMaterialInput {
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
