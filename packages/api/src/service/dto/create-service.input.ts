import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreateServiceInput {
  @IsString()
  @IsNotEmpty()
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
