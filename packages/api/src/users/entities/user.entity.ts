// Grahpql
import { ObjectType, Field, ID } from '@nestjs/graphql'
// Typeorm
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm'

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// User entity
@Entity()
@ObjectType()
export class User {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string

  @Column()
  @Field()
  UID: string

  @Column()
  @Field()
  locale?: string

  @Column({ default: Role.USER })
  @Field(() => String)
  role: Role

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
