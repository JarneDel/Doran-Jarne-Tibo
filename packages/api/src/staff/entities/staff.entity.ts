import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/users/entities/user.entity'
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm'
import { WorkingHoursEntity } from './workingHours.entity'

@Entity()
@ObjectType()
export class Staff extends User {
  @Field()
  @Column()
  firstName: string

  @Field()
  @Column()
  lastName: string

  @Field()
  @Column()
  email: string

  @Field()
  @Column()
  phone: string

  @Field()
  @Column()
  holidaysLeft: number

  @Field(() => [Date], { nullable: true })
  @Column()
  holidayDates: Date[]

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date

  @Field(() => [WorkingHoursEntity], { nullable: true })
  @Column('jsonb', { nullable: true })
  workingHours: WorkingHoursEntity[]
}
