import { ObjectType, Field, Int, ID, InputType } from "@nestjs/graphql";
import { Sport } from "src/sport/entities/sport.entity";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@InputType('MaterialsInput')
@ObjectType()
export class Materials {
  @Column()
  @Field()
  name: string

  @Column()
  @Field()
  totalAmount: number

  @Column()
  @Field()
  wantedAmount: number

  @Column()
  @Field()
  price: number

  @Column()
  @Field(() => [String], { nullable: true })
  sports: string[]

  @Column()
  @Field()
  isComplete: boolean

  @Column()
  @Field({ nullable: true })
  description?: string
}
