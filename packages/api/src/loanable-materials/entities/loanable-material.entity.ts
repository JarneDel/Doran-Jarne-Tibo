import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
@ObjectType()
export class LoanableMaterial {
  @ObjectIdColumn()
  @Field()
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
