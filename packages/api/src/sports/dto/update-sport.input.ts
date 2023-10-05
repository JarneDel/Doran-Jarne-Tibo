// Create input
import { CreateSportInput } from './create-sport.input'
// GraphQL
import { InputType, Field, PartialType } from '@nestjs/graphql'
// Class validator
import { IsString, IsNotEmpty, MinLength } from 'class-validator'

@InputType()
export class UpdateSportInput extends PartialType(CreateSportInput) {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Field() // Graphql
  name: string
}
