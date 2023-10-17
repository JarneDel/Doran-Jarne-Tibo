// Grahpql
import { Field, ID, ObjectType } from '@nestjs/graphql'
// Entities
import { Sport } from 'src/sport/entities/sport.entity'
// Typeorm
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType()
export class Room {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // Graphql
  id: string

  @Column() // Database link - Typeorm
  @Field() // Graphql
  name: string

  @Field(() => [Sport], { nullable: true })
  sports: [Sport]

  @Column({ type: 'array' })
  SportId: string[]

  @Column() // Database link - Typeorm
  @Field() // Graphql
  pricePerHour: number

  @Column() // Database link - Typeorm
  @Field() // Graphql
  type: string

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
