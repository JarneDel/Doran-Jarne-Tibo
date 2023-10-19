// Create input
import { CreateRoomInput } from './create-room.input'
// GraphQL
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'
// Typeorm
import { ObjectIdColumn } from 'typeorm'
// Class validator
import {
  IsString,
  IsNotEmpty,
  MinLength,
  Max,
  IsIn,
  IsPositive,
  Min,
  IsBoolean,
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
  @ObjectIdColumn()
  @Field(() => ID)
  _id: string

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

  @IsBoolean()
  @Field({ defaultValue: true }) // Graphql
  canBeUsed: boolean
}
