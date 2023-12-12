// GraphQL
import { InputType, Int, Field } from '@nestjs/graphql'
// Class validator
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator'

@InputType()
export class CreateSportInput {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Field() // Graphql
  name: string

  @MaxLength(250)
  @Field() // Graphql
  description: string
}
