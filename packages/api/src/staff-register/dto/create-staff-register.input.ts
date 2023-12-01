import { Field } from '@nestjs/graphql'

export class CreateStaffRegisterInput {
  @Field()
  firstName: string
}
