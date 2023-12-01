import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Role } from '../../users/entities/user.entity'

@Entity()
@ObjectType()
export class StaffRegister {
  @ObjectIdColumn()
  @Field(() => ID) // Graphql
  id: string

  @Field()
  @Column()
  firstName: string

  @Field()
  @Column()
  lastName: string

  @Field()
  @Column()
  email: string

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date

  @Field()
  @Column({ type: 'timestamp' })
  expiresAt: Date

  @Field()
  @Column({ default: Role.STAFF })
  role: Role

  @Field()
  @Column({ default: false })
  isRegistered: boolean

  @Field({ nullable: true, defaultValue: 25 })
  @Column({ nullable: true, default: 25 })
  holidayCount?: number
}
