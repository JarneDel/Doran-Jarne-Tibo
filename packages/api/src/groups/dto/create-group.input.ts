import { Field, InputType } from '@nestjs/graphql'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator'
import { CreateUserInput } from 'src/users/dto/create-user.input'

@InputType()
export class CreateGroupInput extends CreateUserInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Field()
  name: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string

  @IsOptional()
  @IsString()
  @MinLength(12)
  @Field({ nullable: true })
  btwNumber: string

  @IsOptional()
  @IsUrl()
  @Field({ nullable: true })
  profilePictureUrl: string
}
