import { CreateReservationInput } from './create-reservation.input'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'
import { Rooms } from '../entities/room.entity'
import { Materials } from '../entities/material.entity'
import { Type } from 'class-transformer'

@InputType()
export class UpdateReservationInput extends PartialType(
  CreateReservationInput,
) {
  @Field()
  id: string
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
  @Field(() => [Materials])
  reserved_materials: [Materials]
  @Field()
  price: number
}
