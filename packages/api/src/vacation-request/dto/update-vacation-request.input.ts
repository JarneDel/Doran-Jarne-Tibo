import { CreateVacationRequestInput } from './create-vacation-request.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVacationRequestInput extends PartialType(CreateVacationRequestInput) {
  @Field(() => Int)
  id: number;
}
