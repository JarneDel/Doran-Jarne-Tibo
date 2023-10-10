import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Staff {
  @ObjectIdColumn()
  @Field(() => ID)
  id: string

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
}
