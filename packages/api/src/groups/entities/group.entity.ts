import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { number } from 'yargs';

@Entity()
@ObjectType()
export class Group {
  @ObjectIdColumn()
  @Field(()=>ID, {nullable:true})
  _id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field({nullable:true})
  btw_number: string;

  @Column()
  @Field({defaultValue:0})
  score: number;
}
