import { InputType, Int, Field } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Room } from 'src/room/entities/room.entity'
import { Rooms } from '../entities/room.entity'
import { Materials } from '../entities/material.entity'
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsString, Min } from 'class-validator'

@InputType()
export class CreateReservationInput {
  @IsDate()
  @Field()
  date: Date
  @IsString()
  @Field()
  start_time: string
  @IsString()
  @Field()
  end_time: string
  @IsString()
  @Field()
  group_id: string
  @IsNotEmpty()
  @Type(type => Rooms)
  @Field(() => [Rooms])
  rooms: [Rooms]
  @IsNotEmpty()
  @Type(type => Materials)
  @Field(() => [Materials])
  reserved_materials: [Materials]
  @IsInt()
  @Min(0)
  @Field()
  price: number
}
