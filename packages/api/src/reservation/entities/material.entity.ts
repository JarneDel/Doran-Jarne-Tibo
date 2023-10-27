import { ObjectType, Field, Int, ID, InputType } from "@nestjs/graphql";
import { Sport } from "src/sport/entities/sport.entity";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@InputType('MaterialsInput')
@ObjectType()
export class Materials {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string
  @Column()
  @Field({nullable:true})
  name: string

  @Column()
  @Field({nullable:true})
  totalAmount: number

  @Column()
  @Field({nullable:true})
  wantedAmount: number

  @Column()
  @Field({nullable:true})
  price: number

  @Column()
  @Field(() => [String], { nullable: true })
  sports: string[]

  @Column()
  @Field({nullable:true})
  isComplete: boolean

  @Column()
  @Field({ nullable: true })
  description?: string

  @Column()
  @Field({ nullable: true })
  amountReserved: number
}
