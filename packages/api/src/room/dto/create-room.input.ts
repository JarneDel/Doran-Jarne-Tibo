import { InputType, Field, ID } from '@nestjs/graphql'

@InputType()
export class CreateRoomInput {
  @Field() // Graphql
  name: string

  @Field(() => [String]) // Graphql
  sports: string[]

  @Field({ defaultValue: 0 }) // Graphql
  pricePerHour: number

  @Field({ defaultValue: 'Sport zaal.' }) // Graphql
  type: string
}
