import { CreateRepairRequestInput } from './create-repair-request.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRepairRequestInput extends PartialType(CreateRepairRequestInput) {
  @Field(() => Int)
  id: number;
}
