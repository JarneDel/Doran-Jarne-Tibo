import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity';
import { Room } from 'src/room/entities/room.entity';
import { Column, ObjectIdColumn } from 'typeorm';

@ObjectType()
export class Reservation {
  @ObjectIdColumn()
  @Field(()=>ID, {nullable:true})
  _id: string;
  @Column()
  @Field()
  date: Date;
  @Column()
  @Field()
  start_time: string;
  @Column()
  @Field()
  end_time: string;
  @Column()
  @Field()
  group_id: string;
  @Column()
  @Field()
  reserved_materials: [LoanableMaterial]
  @Column()
  @Field()
  rooms: [Room]
  @Column()
  @Field()
  price: number;
}