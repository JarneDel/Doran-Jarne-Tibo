import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@InputType('Rooms') // Database link - Typeorm
@ObjectType()
export class Rooms {
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
}
