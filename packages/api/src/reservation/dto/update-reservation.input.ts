import { CreateReservationInput } from './create-reservation.input'
import { InputType, Field, Int, PartialType } from '@nestjs/graphql'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Room } from 'src/room/entities/room.entity'
import { Type } from 'class-transformer'
import { Rooms } from '../entities/room.entity'
import { Materials } from '../entities/material.entity'
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

@InputType()
export class UpdateReservationInput extends PartialType(
  CreateReservationInput,
) {
  @IsString()
  @Field()
  id: string
  @IsDate()
  @Field()
  date: Date
  @IsString()
  @Field()
  startTime: string
  @IsString()
  @Field()
  endTime: string
  @IsString()
  @Field()
  groupId: string
  @IsNotEmpty()
  @Type(type => Rooms)
  @Field(() => [Rooms])
  rooms: [Rooms]
  @IsNotEmpty()
  @Type(type => Materials)
  @Field(() => [Materials])
  reservedMaterials: [Materials]
  @IsNumber()
  @Min(0)
  @Field()
  price: number
  @IsBoolean()
  @Field()
  isCancelled: boolean
}
