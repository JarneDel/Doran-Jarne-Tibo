import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType()
export class Stock {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // Graphql
  id: string

  @Column() // Database link - Typeorm
  @Field() // Graphql
  name: string

  @Column() // Database link - Typeorm
  @Field() // Graphql
  description: string

  @Column() // Database link - Typeorm
  @Field() // Graphql
  needToOrderMore: boolean

  @Column() // Database link - Typeorm
  @Field() // Graphql
  amountInStock: number

  @Column() // Database link - Typeorm
  @Field() // Graphql
  service: string

  @Column()
  @Field()
  idealStock: number
}
