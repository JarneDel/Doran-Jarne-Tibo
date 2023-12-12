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
  @MinLength(4)
  @Field() // Graphql
  name: string

  @Field(() => [String], { nullable: true })
  SportId: string[]

  @Max(1000)
  @Min(0)
  @Field() // Graphql
  pricePerHour: number

  @IsNotEmpty()
  @IsIn(typeList)
  @Field() // Graphql
  type: string

  @IsBoolean()
  @Field({ defaultValue: true }) // Graphql
  canBeUsed: boolean
}
