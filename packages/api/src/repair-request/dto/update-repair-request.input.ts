// Inputs
import { CreateRepairRequestInput } from './create-repair-request.input';
// Graphql
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
// Class Validator
import { IsBoolean, Min, Max, IsNotEmpty, MinLength } from 'class-validator'
// Typeorm
import { ObjectIdColumn } from 'typeorm';

@InputType()
export class UpdateRepairRequestInput  {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string;

  @IsNotEmpty()
  @MinLength(4)
  @Field()
  title: string;

  @IsNotEmpty()
  @Field()
  @MinLength(4)
  description: string;

  @IsBoolean()
  @Field()
  isRepaired: boolean;
  
  @Min(1)
  @Max(3)
  @Field()
  urgency: number
}
