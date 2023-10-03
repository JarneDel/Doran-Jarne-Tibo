import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateStaffInput {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  email: string

  @Field()
  phone: string

  @Field()
  holidaysLeft: number

  @Field(() => [Date])
  holidayDates: Date[]
}
