import { ObjectType, Field, ID } from '@nestjs/graphql'
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

  @Field(() => [Staff])
  staff: Staff

  @Column()
  staffId: string

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  @Field({ nullable: false })
  startDate: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  @Field({ nullable: false })
  endDate: Date

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @Column()
  @Field()
  isApproved: boolean

  @Column()
  @Field()
  isRejected: boolean

  @Column()
  @Field()
  rejectReason: string

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
