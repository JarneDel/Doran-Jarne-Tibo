import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class FilterStockArgs {
  @Field({ nullable: true })
  orderDirection?: string

  @Field({ nullable: true })
  orderByField?: string

  @Field({ nullable: true })
  searchName?: string
}
