import { Field, InputType } from '@nestjs/graphql'
import { IsPhoneNumber } from 'class-validator'

@InputType()
export class StaffSignUpInput {
  @Field()
  id: string

  @Field()
  uid: string

  @Field()
  locale: string

  @Field()
  @IsPhoneNumber('BE', { message: 'Invalid phone number' })
  phone: string
}
