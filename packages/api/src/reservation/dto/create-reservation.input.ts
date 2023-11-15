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
  @IsInt()
  @Min(0)
  @Field()
  price: number
}
