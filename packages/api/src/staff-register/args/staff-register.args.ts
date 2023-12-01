import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class StaffRegisterArgs {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  email?: string
}
