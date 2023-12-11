// Create input
import { CreateServiceInput } from './create-service.input'
// GraphQL
import { Field, InputType, PartialType, ID } from '@nestjs/graphql'
// Typeorm
import { ObjectIdColumn } from 'typeorm'
// Class validator
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class UpdateServiceInput extends PartialType(CreateServiceInput) {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string

  @IsString()
  @IsNotEmpty()
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
