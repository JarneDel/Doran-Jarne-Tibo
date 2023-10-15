import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RepairRequest {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
