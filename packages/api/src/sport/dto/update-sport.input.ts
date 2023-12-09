// Create input
import { CreateSportInput } from './create-sport.input'
// GraphQL
import { InputType, Field, PartialType } from '@nestjs/graphql'
// Class validator
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

@InputType()
export class UpdateSportInput extends PartialType(CreateSportInput) {
  @Field() // Graphql
  id: string

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Field() // Graphql
  name: string

  @MaxLength(250)
  @Field() // Graphql
  description: string
}
