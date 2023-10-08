import { CreateServiceInput } from './create-service.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateServiceInput extends PartialType(CreateServiceInput) {
  @Field(() => String)
  id: string
}
