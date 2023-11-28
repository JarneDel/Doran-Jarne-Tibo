import { ObjectIdColumn } from 'typeorm'
import { CreateLoanableMaterialInput } from './create-loanable-material.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'

import {
  IsString,
  IsNumber,
  IsNotEmpty,
  MinLength,
  Max,
  IsIn,
  IsPositive,
  Min,
  IsBoolean,
  MaxLength,
} from 'class-validator'

@InputType()
export class UpdateLoanableMaterialInput extends PartialType(
  CreateLoanableMaterialInput
) {
  @ObjectIdColumn()
  @Field(() => ID)
  _id: string

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Field()
  name: string

  @IsNumber()
  @Min(0)
  @Max(1000)
  @Field()
  totalAmount: number

  @IsNumber()
  @Min(0)
  @Max(1000)
  @Field()
  wantedAmount: number

  @Field(() => [String], { nullable: true })
  SportId: string[]

  @IsNumber()
  @Min(0)
  @Max(1000)
  @Field()
  price: number

  @IsBoolean()
  @Field()
  isComplete: boolean

  @IsString()
  @MaxLength(200)
  @Field({ nullable: true })
  description?: string
}
