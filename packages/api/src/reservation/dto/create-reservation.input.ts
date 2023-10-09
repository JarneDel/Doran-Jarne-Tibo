import { InputType, Int, Field } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { Materials } from '../entities/material.entity'
import { Rooms } from '../entities/room.entity'

@InputType()
export class CreateReservationInput {
  @Field()
  date: Date
  @Field()
  start_time: string
  @Field()
  end_time: string
  @Field()
  group_id: string
  @Type(type => Rooms)
  @Field(() => [Rooms])
  rooms: [Rooms]
  @Type(type => Materials)
  @Field(() => [Materials])
  reserved_materials: [Materials]
  @Field()
  price: number
}
