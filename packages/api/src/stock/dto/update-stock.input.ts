import { CreateStockInput } from './create-stock.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Min } from 'class-validator'

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

  @Min(0)
  @Field({ defaultValue: 0 }) //graphql
  amountInStock: number

  @Min(0)
  @Field({ nullable: true }) //graphql
  idealStock: number
}
