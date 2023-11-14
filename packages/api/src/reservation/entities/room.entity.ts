import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'
import { Sports } from './sport.entity'
import { Column, ObjectIdColumn } from 'typeorm'

@InputType('RoomsInput') // Database link - Typeorm
@ObjectType()
export class Rooms {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string
  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // Graphql
  name: string

  @Column() // Database link - Typeorm
  @Field(() => [Sports], { nullable: true }) // Graphql
  sports: Sports[]

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // Graphql
  pricePerHour: number

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // Graphql
  type: string
}
