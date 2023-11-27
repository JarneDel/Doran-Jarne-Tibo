import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class FindVacationArgs {
  @Field(() => Boolean, { nullable: true })
  isOpen?: boolean

  @Field(() => Boolean, { nullable: true })
  isExpired?: boolean
}
