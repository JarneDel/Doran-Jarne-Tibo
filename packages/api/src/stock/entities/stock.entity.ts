import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Stock {
  @ObjectIdColumn()
  @Field(() => ID) // Graphql
  id: string

  @Column()
  @Field() // Graphql
  name: string

  @Column()
  @Field() // Graphql
  description: string

  @Column()
  @Field() // Graphql
  needToOrderMore: boolean

  @Column()
  @Field() // Graphql
  amountInStock: number

  @Column()
  @Field() // Graphql
  service: string

  @Column()
  @Field()
  idealStock: number
}
