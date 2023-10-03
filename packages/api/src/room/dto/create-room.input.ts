import { InputType, Field, ID } from '@nestjs/graphql'

@InputType()
export class CreateRoomInput {
  @Field() // Graphql
  name: boolean

  @Field() // Graphql
  sport: string

  @Field({ defaultValue: 0 }) // Graphql
  price: number

  @Field({ defaultValue: 'Sport zaal.' }) // Graphql
  type: string
}
