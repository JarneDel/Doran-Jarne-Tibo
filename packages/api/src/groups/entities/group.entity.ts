import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Group {
  @ObjectIdColumn()
  @Field(()=>ID)
  _id: string;

  @Column()
  @Field()
  name: string;
}
