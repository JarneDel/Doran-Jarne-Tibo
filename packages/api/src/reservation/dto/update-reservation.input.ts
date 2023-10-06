import { CreateReservationInput } from './create-reservation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { Room } from 'src/room/entities/room.entity';
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity';

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
  @Field(()=>[Room])
  rooms: [Room]
  @Field(() => [LoanableMaterial])
  reserved_materials: [LoanableMaterial]
  @Field()
  price: number
}
