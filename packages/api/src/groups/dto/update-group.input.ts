import { ObjectId } from 'mongodb';
import { CreateGroupInput } from './create-group.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { ObjectIdColumn } from 'typeorm';

@InputType()
export class UpdateGroupInput extends PartialType(CreateGroupInput) {
  @ObjectIdColumn()
  @Field(()=>ID)
  _id: string
  @Field()
  name: string
  @Field({ nullable: true })
  btw_number: string
  @Field({ defaultValue: 0 })
  score: number
}

@InputType()
export class UpdateGroupScoreInput {
  @Field()
  score: number;
}
