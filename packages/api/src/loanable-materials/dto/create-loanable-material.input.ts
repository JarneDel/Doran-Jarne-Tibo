import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLoanableMaterialInput {
  @Field()
  name: string

  @Field()
  fullname: string

  @Field()
  category: string

  @Field()
  url: string

  @Field({ defaultValue: 0 })
  observations: number

  @Field({ nullable: true })
  description?: string
}
