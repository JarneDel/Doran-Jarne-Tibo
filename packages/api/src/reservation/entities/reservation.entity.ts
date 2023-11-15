import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Materials } from './material.entity'
import { Room } from 'src/room/entities/room.entity'
import { Rooms } from './room.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Group } from 'src/groups/entities/group.entity'

@Entity()
@ObjectType()
export class Reservation {
  @ObjectIdColumn()
  @Field(() => ID, { nullable: true })
  id: string

  @Column()
  @Field()
  date: Date

  @Column()
  @Field()
  startTime: string

  @Column()
  @Field()
  endTime: string

  @Field(() => Group)
  group: Group

  @Column()
  groupId: string

  @Column()
  @Field(() => [Materials])
  reservedMaterials: [Materials]

  @Column()
  @Field(() => [Rooms])
  rooms: [Rooms]

  @Column()
  @Field()
  price: number

  @Column()
  @Field({ defaultValue: false })
  isCancelled: boolean

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
