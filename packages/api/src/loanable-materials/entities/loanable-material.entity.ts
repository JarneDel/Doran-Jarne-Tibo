import { ObjectType, Field, Int, ID } from "@nestjs/graphql";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
@ObjectType()
export class LoanableMaterial {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  loanedOut: boolean;

  @Column()
  @Field()
  totalAmount: number;

  @Column()
  @Field()
  isComplete: boolean;

  @Column()
  @Field({ nullable: true })
  description?: string;

  // @Column()
  // @Field({ nullable: true })
  // materialInSet?: Array<JSON>;
}