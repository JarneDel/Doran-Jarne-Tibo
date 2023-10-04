import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { Staff } from '../../staff/entities/staff.entity'

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

  @Field()
  staff: Staff

  @Column()
  staffId: string
}
