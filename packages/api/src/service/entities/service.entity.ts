import { ObjectType, Field, Int, ID } from '@nestjs/graphql'
import { Column, Entity, ObjectIdColumn, OneToOne } from 'typeorm'

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

  // linked to rooms
}
