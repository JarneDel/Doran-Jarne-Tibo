import { CreateStockInput } from './create-stock.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateStockInput extends PartialType(CreateStockInput) {
  @Field()
  id: string

  @Field()
  name: string

  @Field({ nullable: true }) //graphql
  description: string

  @Field({ defaultValue: 0 }) //graphql
  needToOrderMore: boolean

  @Field({ defaultValue: 0 }) //graphql
  amountInStock: number

  @Field({ nullable: true }) //graphql
  idealStock: number
}
