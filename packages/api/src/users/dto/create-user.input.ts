import { InputType, Field } from '@nestjs/graphql'
import { IsUrl } from 'class-validator'

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Optional locale of the current user.' })
  locale?: string

  @Field(() => String)
  @IsUrl()
  profilePictureUrl?: string
}
