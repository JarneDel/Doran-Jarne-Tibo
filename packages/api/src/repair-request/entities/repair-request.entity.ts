// Graphql
import { ObjectType, Field, ID, createUnionType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { type } from 'os'
import { Group } from 'src/groups/entities/group.entity'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
// Entities
import { Room } from 'src/room/entities/room.entity'
import { Staff } from 'src/staff/entities/staff.entity'
// Typeorm
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'

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
  @Field({ nullable: true })
  description?: string

  @Column()
  @Field(() => [String], { nullable: true })
  room: Room

  @Column()
  @Field(() => [String], { nullable: true })
  loanableMaterial: LoanableMaterial

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date
}
