import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from 'src/users/entities/user.entity'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
@ObjectType()
export class Staff extends User {
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
