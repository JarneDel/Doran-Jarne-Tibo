import { ObjectType, Field, Int, ID, InputType } from "@nestjs/graphql";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@InputType('MaterialsInput')
@ObjectType()
export class Materials {
  @Column()
  @Field()
  name: string

  @Column()
  @Field()
  loanedOut: boolean

  @Column()
  @Field()
  totalAmount: number

  @Column()
  @Field()
  isComplete: boolean

  @Column()
  @Field({ nullable: true })
  description?: string

  // @Column()
  // @Field({ nullable: true })
  // materialInSet?: Array<JSON>;
}
