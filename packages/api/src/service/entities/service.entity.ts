import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { Staff } from '../../staff/entities/staff.entity'
import { Room } from '../../room/entities/room.entity'

@Entity()
@ObjectType()
export class Service {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  description: string

  // todo: linked to rooms

  @Field(() => [Staff])
  staff: Staff[]

  @Column({ type: 'array', default: [] })
  staffId: string[]

  @Field(() => [Room])
  rooms: Room[]

  @Column({ type: 'array', default: [] })
  roomId: string[]
}
