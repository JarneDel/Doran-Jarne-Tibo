// Create input
import { CreateRoomInput } from './create-room.input'
// GraphQL
import { InputType, Field, PartialType } from '@nestjs/graphql'
// Class validator
import {
  IsString,
  IsNotEmpty,
  MinLength,
  Max,
  IsIn,
  IsPositive,
  Min,
} from 'class-validator'

const typeList = [
  'Sportzaal',
  'Kleedruimte',
  'Werkruimte',
  'Zwembad',
  'Duikput',
]

@InputType()
export class UpdateRoomInput extends PartialType(CreateRoomInput) {
  @Field() // Graphql
  id: string

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Field() // Graphql
  name: string

  @Field(() => [String]) // Graphql
  sports: string[]

  @Max(1000)
  @Min(0)
  @IsPositive()
  @Field() // Graphql
  pricePerHour: number

  @IsNotEmpty()
  @IsIn(typeList)
  @Field({ defaultValue: 'Sportzaal' }) // Graphql
  type: string
}
