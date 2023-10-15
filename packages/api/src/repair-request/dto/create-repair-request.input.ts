// Graphql
import { InputType, Field } from '@nestjs/graphql';
// Class Validator
import { IsString, IsBoolean, IsNumber, IsNotEmpty, MinLength, Max, IsIn, IsPositive, Min } from 'class-validator'
// Entities
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity';
import { Room } from 'src/room/entities/room.entity';

@InputType()
export class CreateRepairRequestInput {
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  room: Room;

  @Field(() => [String], { nullable: true })
  loanableMaterial: LoanableMaterial;
}
