import { ObjectId } from 'mongodb';
import { CreateGroupInput } from './create-group.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { ObjectIdColumn } from 'typeorm';
import { IsInt, IsNotEmpty, IsString, Max, Min, MinLength } from 'class-validator';

@InputType()
export class UpdateGroupInput extends PartialType(CreateGroupInput) {
  @ObjectIdColumn()
  @Field(() => ID)
  _id: string
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @Field()
  name: string
  @IsString()
  @MinLength(12)
  @Field({ nullable: true })
  btw_number: string
  @Max(100)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Field({ defaultValue: 0 })
  score: number
}

@InputType()
export class UpdateGroupScoreInput {
  @Max(100)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Field()
  score: number
}
