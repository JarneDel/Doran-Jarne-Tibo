import { CreateRoomInput } from './create-room.input'
import { InputType, Field, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateRoomInput extends PartialType(CreateRoomInput) {
  @Field() // Graphql
  id: string

  @Field() // Graphql
  name: string

  @Field(() => [String]) // Graphql
  sports: string[]

  @Field() // Graphql
  price: number

  @Field() // Graphql
  type: string
}
