import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class WorkingHoursEntity {
  @Field({ nullable: true })
  day: number

  @Field({ nullable: true })
  startTime: string

  @Field({ nullable: true })
  endTime: string
}

@InputType()
export class WorkingHoursInput extends WorkingHoursEntity {}
