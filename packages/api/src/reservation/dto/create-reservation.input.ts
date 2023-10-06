import { InputType, Int, Field } from '@nestjs/graphql';
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity';
import { Room } from 'src/room/entities/room.entity';

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
  @Field(()=>[LoanableMaterial])
  reserved_materials: [LoanableMaterial]
  @Field(()=>[Room])
  rooms: [Room]
  @Field()
  price: number
}
