// Graphql
import { InputType, Field } from "@nestjs/graphql";
// Class Validator
import { IsString, IsBoolean, IsNumber, IsNotEmpty, MinLength, Max, IsIn, IsPositive, Min } from 'class-validator'

@InputType()
export class CreateLoanableMaterialInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Field()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(1000)
  @Field()
  totalAmount: number;

  @IsNumber()
  @Min(0)
  @Max(1000)
  @Field()
  wantedAmount: number;

  @Field(() => [String], { nullable: true })
  SportId: string[];

  @IsNumber()
  @Min(0)
  @Max(1000)
  @Field()
  price: number;

  @IsBoolean()
  @Field()
  isComplete: boolean;

  @IsString()
  @Field({ nullable: true })
  description?: string;
}
