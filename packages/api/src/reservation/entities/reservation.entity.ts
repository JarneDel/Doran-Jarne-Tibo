import { ObjectType, Field, Int, ID } from '@nestjs/graphql'
import { Materials } from './material.entity'
import { Rooms } from '../entities/room.entity'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Reservation {
  @ObjectIdColumn()
  @Field(() => ID, { nullable: true })
  _id: string
  @Column()
  @Field()
  date: Date
  @Column()
  @Field()
  start_time: string
  @Column()
  @Field()
  end_time: string
  @Column()
  @Field()
  group_id: string
  @Column()
  @Field(() => [Rooms])
  rooms: [Rooms]
  @Column()
  @Field(() => [Materials])
  reserved_materials: [Materials]
  @Column()
  @Field()
  price: number
}
