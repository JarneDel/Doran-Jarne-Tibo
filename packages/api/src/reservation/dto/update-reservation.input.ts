import { CreateReservationInput } from './create-reservation.input'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Room } from 'src/room/entities/room.entity'
import { Type } from 'class-transformer'
import { Rooms } from '../entities/room.entity'
import { Materials } from '../entities/material.entity'

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
  @Field()
  isCancelled: boolean
}
