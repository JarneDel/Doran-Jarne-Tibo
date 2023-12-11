// GraphQL
import { InputType, Int, Field } from '@nestjs/graphql'
// Class validator
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

@InputType()
export class CreateSportInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Field() // Graphql
  name: string

  @MaxLength(250)
  @Field() // Graphql
  description: string
}
