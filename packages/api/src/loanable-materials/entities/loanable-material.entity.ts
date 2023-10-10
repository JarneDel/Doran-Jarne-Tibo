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
  totalAmount: number;

  @Column()
  @Field()
  wantedAmount: number;

  @Column()
  @Field()
  price: number;

  @Column()
  @Field(() => [String], { nullable: true })
  sports: string[];

  @Column()
  @Field()
  isComplete: boolean;

  @Column()
  @Field({ nullable: true })
  description?: string;

}
