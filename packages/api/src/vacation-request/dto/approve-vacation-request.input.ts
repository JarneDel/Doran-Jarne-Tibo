import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ApproveVacationRequestInput {
  @Field({ nullable: false })
  id: string

  @Field({ nullable: false, defaultValue: false })
  isApproved: boolean

  @Field({ nullable: false, defaultValue: false })
  isRejected: boolean

  @Field({ nullable: true })
  rejectReason: string
}
