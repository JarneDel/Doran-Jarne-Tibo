import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
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
