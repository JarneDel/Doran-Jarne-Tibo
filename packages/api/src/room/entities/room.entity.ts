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
  name: string

  @Column() // Database link - Typeorm
  @Field(() => [String], {nullable:true}) // Graphql
  sports: string[]

  @Column() // Database link - Typeorm
  @Field() // Graphql
  pricePerHour: number

  @Column() // Database link - Typeorm
  @Field() // Graphql
  type: string

  @Column() // Database link - Typeorm
  @Field( {defaultValue:true}) // Graphql
  canBeUsed: boolean
}
