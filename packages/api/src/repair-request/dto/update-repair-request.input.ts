// Inputs
import { CreateRepairRequestInput } from './create-repair-request.input';
// Graphql
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
// Class Validator
import { IsBoolean } from 'class-validator'
// Typeorm
import { ObjectIdColumn } from 'typeorm';

@InputType()
export class UpdateRepairRequestInput  {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string;

  @IsBoolean()
  @Field()
  isRepaired: boolean;
}
