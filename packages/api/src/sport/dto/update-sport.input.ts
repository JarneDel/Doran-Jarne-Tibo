// Create input
import { CreateSportInput } from './create-sport.input'
// GraphQL
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'
// Class validator
import { IsString, IsNotEmpty, MinLength } from 'class-validator'

@InputType()
export class UpdateSportInput extends PartialType(CreateSportInput) {
  @Field() // Graphql
  id: string

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Field() // Graphql
  name: string
}
