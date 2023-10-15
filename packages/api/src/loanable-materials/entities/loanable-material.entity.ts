import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";

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

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date

}
