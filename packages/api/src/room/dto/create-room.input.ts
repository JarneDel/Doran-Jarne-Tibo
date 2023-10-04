import { InputType, Field } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MinLength, Max, IsIn } from 'class-validator'

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
  @MinLength(3)
  @Field() // Graphql
  name: string

  @Field(() => [String]) // Graphql
  sports: string[]

  @Max(1000)
  @Field({ defaultValue: 0 }) // Graphql
  pricePerHour: number

  @IsNotEmpty()
  @IsIn(typeList)
  @Field({ defaultValue: 'Sport zaal.' }) // Graphql
  type: string
}
