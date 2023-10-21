import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Sport } from 'src/sport/entities/sport.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
@ObjectType()
export class LoanableMaterial {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string

  @Column()
  @Field()
  name: string

  @Column()
  @Field()
  totalAmount: number

  @Column()
  @Field()
  wantedAmount: number

  @Column()
  @Field()
  price: number

  @Field(() => [Sport], { nullable: true })
  sports: [Sport]

  @Column({ type: 'array' })
  SportId: string[]

  @Column()
  @Field()
  isComplete: boolean

  @Column()
  @Field({ nullable: true })
  description?: string

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
