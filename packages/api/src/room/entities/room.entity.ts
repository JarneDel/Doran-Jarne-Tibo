import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType()
export class Room {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // Graphql
  id: string

  @Column() // Database link - Typeorm
  @Field() // Graphql
  name: boolean

  @Column() // Database link - Typeorm
  @Field() // Graphql
  sport: string

  @Column() // Database link - Typeorm
  @Field() // Graphql
  price: number

  @Column() // Database link - Typeorm
  @Field() // Graphql
  type: string
}
