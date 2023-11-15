import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Staff } from '../../staff/entities/staff.entity'

@Entity()
@ObjectType()
export class VacationRequest {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string

  @Field(() => Staff)
  staff: Staff

  @Column()
  staffUId: string

  @Column({ type: 'date' })
  @Field({ nullable: false })
  startDate: Date

  @Column({ type: 'date' })
  @Field({ nullable: false })
  endDate: Date

  @Column()
  @Field({ defaultValue: false })
  isApproved: boolean

  @Column()
  @Field({ defaultValue: false })
  isRejected: boolean

  @Column({ nullable: true })
  @Field({ nullable: true })
  rejectReason: string

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
