import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateGroupInput {
  @Field()
  name: string;
  @Field({nullable:true})
  btw_number: string;
  @Field({defaultValue:0})
  score: number;
}
