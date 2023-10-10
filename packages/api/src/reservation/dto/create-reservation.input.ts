import { InputType, Int, Field } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Room } from 'src/room/entities/room.entity'
import { Rooms } from '../entities/room.entity'
import { Materials } from '../entities/material.entity'

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
