// GraphQL
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
// Typeorm
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm'

@ObjectType() // Graphql
@InputType('SportInput')
@Entity() // Database link - Typeorm
export class Sports {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // Graphql
  id: string

  @Column() // Database link - Typeorm
  @Field() // Graphql
  name: string

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
