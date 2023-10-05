// GraphQL
import { ObjectType, Field, ID } from '@nestjs/graphql';
// Typeorm
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType()
export class Sport {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // Graphql
  id: string
  
  @Column() // Database link - Typeorm
  @Field() // Graphql
  name: string
}
