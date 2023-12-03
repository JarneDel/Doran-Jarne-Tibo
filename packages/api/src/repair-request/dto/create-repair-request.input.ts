// Graphql
import { InputType, Field } from '@nestjs/graphql'
// Class Validator
import {
  IsString,
  ValidateIf,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  MinLength,
  Max,
  IsIn,
  IsPositive,
  Min,
} from 'class-validator'
// Entities
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Room } from 'src/room/entities/room.entity'
// Entities from other modules (reservation)
import { Rooms } from 'src/reservation/entities/room.entity'
import { Materials } from 'src/reservation/entities/material.entity'

@InputType()
export class CreateRepairRequestInput {
  @Field()
  requestUserId: string

  @IsNotEmpty()
  @MinLength(4)
  @Field()
  title: string

  @IsString()
  @Field({ nullable: true })
  description?: string

  // Either room or loanableMaterial should be filled in (validateIf)
  @ValidateIf(o => o.loanableMaterial == undefined)
  @IsNotEmpty()
  @Field(() => [Rooms], { nullable: true })
  room: Rooms[]

  @ValidateIf(o => o.room == undefined)
  @IsNotEmpty()
  @Field(() => [Materials], { nullable: true })
  loanableMaterial: Materials[]
}
