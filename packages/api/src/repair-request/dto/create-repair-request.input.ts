import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRepairRequestInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
