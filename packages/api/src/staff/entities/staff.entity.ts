import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/users/entities/user.entity'
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm'

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

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date

  // @Field(
  //   () => [
  //     {
  //       day: String,
  //       startTime: String,
  //       endTime: String,
  //     },
  //   ],
  //   {
  //     nullable: true,
  //   },
  // )
  // @Column()
  // workingHours: {
  //   day: string // monday, tuesday, etc
  //   startTime: string // hh:mm
  //   endTime: string // hh:mm
  // }[]
}
