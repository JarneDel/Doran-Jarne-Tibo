import { Field, InputType } from '@nestjs/graphql'
import { Role } from '../../users/entities/user.entity'

@InputType()
export class CreateStaffRegisterInput {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  email: string

  @Field()
  role: Role

  @Field({ nullable: true, defaultValue: 25 })
  holidayCount?: number
}
