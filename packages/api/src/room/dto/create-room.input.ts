import { InputType, Field } from '@nestjs/graphql'
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
export class CreateRoomInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Field() // Graphql
  name: string

  @Field(() => [String], { nullable: true })
  SportId: string[]

  @Min(0)
  @Max(1000)
  @IsPositive()
  @Field({ defaultValue: 0 }) // Graphql
  pricePerHour: number

  @IsNotEmpty()
  @IsIn(typeList)
  @Field({ defaultValue: 'Sportzaal' }) // Graphql
  type: string

  @IsBoolean()
  @Field({ defaultValue: true }) // Graphql
  canBeUsed: boolean
}
