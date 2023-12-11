import { Field, InputType } from '@nestjs/graphql'
import { CreateUserInput } from 'src/users/dto/create-user.input'

@InputType()
export class CreateStaffInput extends CreateUserInput{
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

  @Field(() => [Date], { nullable: true })
  holidayDates: Date[]
}
