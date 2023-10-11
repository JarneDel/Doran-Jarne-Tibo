import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LoanableMaterial } from 'src/loanable-materials/entities/loanable-material.entity'
import { Materials } from './material.entity'
import { Room } from 'src/room/entities/room.entity'
import { Rooms } from './room.entity'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Reservation {
  @ObjectIdColumn()
  @Field(() => ID, { nullable: true })
  _id: string

  @Column()
  @Field()
  date: Date

  @Column()
  @Field()
  start_time: string

  @Column()
  @Field()
  end_time: string

  @Column()
  @Field()
  group_id: string

  @Column()
  @Field(() => [Materials])
  reserved_materials: [Materials]

  @Column()
  @Field(() => [Rooms])
  rooms: [Rooms]

  @Column()
  @Field()
  price: number

  @Column()
  @Field({ defaultValue: false })
  isCancelled: boolean
}
