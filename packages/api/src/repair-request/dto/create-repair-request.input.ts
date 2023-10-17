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

@InputType()
export class CreateRepairRequestInput {
  @Field()
  requestUserId: string

  @IsString()
  @Field({ nullable: true })
  description?: string

  // Either room or loanableMaterial should be filled in (validateIf)
  @ValidateIf((o) => o.loanableMaterial == undefined)
  @IsNotEmpty()
  @Field(() => [String], { nullable: true })
  room: Room

  @ValidateIf((o) => o.room == undefined)
  @IsNotEmpty()
  @Field(() => [String], { nullable: true })
  loanableMaterial: LoanableMaterial
}
