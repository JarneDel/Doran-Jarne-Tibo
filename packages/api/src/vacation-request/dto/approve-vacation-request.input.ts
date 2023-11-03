import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, isBoolean } from 'class-validator'

@InputType()
export class ApproveVacationRequestInput {
  @Field({ nullable: false })
  id: string

  @Field({ nullable: false, defaultValue: false })
  @IsBoolean()
  isApproved: boolean

  @Field({ nullable: false, defaultValue: false })
  @IsBoolean()
  isRejected: boolean

  @Field({ nullable: true })
  rejectReason: string
}
