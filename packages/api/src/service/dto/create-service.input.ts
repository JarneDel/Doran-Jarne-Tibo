import { Field, InputType } from '@nestjs/graphql'
import { IsString, MinLength } from 'class-validator'

@InputType()
export class CreateServiceInput {
  @IsString()
  @MinLength(4)
  @Field()
  name: string

  @Field()
  @IsString()
  description: string

  @Field(() => [String], { nullable: true })
  roomId: string[]

  @Field(() => [String], { nullable: true })
  staffUID: string[]
}
