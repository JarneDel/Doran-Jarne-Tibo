// Inputs
import { CreateRepairRequestInput } from './create-repair-request.input';
// Graphql
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
// Class Validator
import { IsString, IsBoolean, IsNumber, IsNotEmpty, MinLength, Max, IsIn, IsPositive, Min } from 'class-validator'
// Entities
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity';
import { Room } from 'src/room/entities/room.entity';
// Typeorm
import { ObjectIdColumn } from 'typeorm';
// Entities from other modules (reservation)
import { Rooms } from 'src/reservation/entities/room.entity'
import { Materials } from 'src/reservation/entities/material.entity'

@InputType()
export class UpdateRepairRequestInput extends PartialType(CreateRepairRequestInput) {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string;

  @IsString()
  @Field({ nullable: true })
  description?: string;

  @Field(() => [Rooms], { nullable: true })
  room: Rooms;

  @Field(() => [Materials], { nullable: true })
  loanableMaterial: Materials;
}
