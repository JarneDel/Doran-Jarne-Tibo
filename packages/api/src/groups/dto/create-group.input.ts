import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MinLength, IsEmail } from 'class-validator';
import { CreateUserInput } from 'src/users/dto/create-user.input';

@InputType()
export class CreateGroupInput extends CreateUserInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @Field()
  name: string

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @Field()
  email: string

  @IsOptional()
  @IsString()
  @MinLength(12)
  @Field({ nullable: true })
  btwNumber: string
}
