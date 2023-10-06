import { CreateReservationInput } from './create-reservation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReservationInput extends PartialType(CreateReservationInput) {
  @Field(()=>Int)
  id: number;
  @Field()
  date: Date;
  @Field()
  start_time: string;
  @Field()
  end_time: string;
  @Field()
  group_id: string;
  @Field()
  reserved_materials: [string]
  @Field()
  rooms: [string]
  @Field()
  price: number;
}
