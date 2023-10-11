import { InputType, Int, Field } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/create-user.input';

@InputType()
export class CreateGroupInput extends CreateUserInput {
  @Field()
  name: string
  @Field({ nullable: true })
  btw_number: string
  @Field({ defaultValue: 0, nullable: false })
  score: number
}
