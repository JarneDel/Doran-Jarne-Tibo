// Graphql
import { ObjectType, Field, ID, createUnionType } from '@nestjs/graphql'
import { Group } from 'src/groups/entities/group.entity'
// Entities
import { Staff } from 'src/staff/entities/staff.entity'
// Typeorm
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'
// Entities from other modules (reservation)
import { Rooms } from 'src/reservation/entities/room.entity'
import { Materials } from 'src/reservation/entities/material.entity'

export const GrSt = createUnionType({
  name: 'GrSt',
  types: () => [Group, Staff] as const,
})

@Entity()
@ObjectType()
export class RepairRequest {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string

  @Field(() => GrSt)
  requestUser: Group | Staff

  @Column()
  requestUserId: string

  @Column()
  @Field()
  title: string

  @Column()
  @Field({ nullable: true })
  description?: string

  @Column()
  @Field(() => [Rooms], { nullable: true })
  room: Rooms[]

  @Column()
  @Field(() => [Materials], { nullable: true })
  loanableMaterial:  Materials[]

  @Column()
  @Field( {defaultValue: 1})
  urgency: number

  @Column()
  @Field()
  isRepaired: boolean

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
