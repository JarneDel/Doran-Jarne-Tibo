import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateLoanableMaterialInput {
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
