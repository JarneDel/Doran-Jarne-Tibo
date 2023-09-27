import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateStockInput {
  @Field()
  name: string

  @Field({ nullable: true }) //graphql
  description: string

  @Field({defaultValue: 0} ) //graphql
  needToOrderMore: boolean

  @Field( { defaultValue: 0}) //graphql
  amountInStock: number

  @Field() //graphql
  service: string

  @Field({nullable: true}) //graphql
  idealStock: number


}
