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

@InputType()
export class UpdateRepairRequestInput extends PartialType(CreateRepairRequestInput) {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string;

  @IsString()
  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  room: Room;

  @Field(() => [String], { nullable: true })
  loanableMaterial: LoanableMaterial;
}
