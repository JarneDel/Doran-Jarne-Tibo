import { Field, InputType } from '@nestjs/graphql'
import { IsDate, MaxDate, MinDate, Validate } from 'class-validator'
import { IsBeforeConstraint } from '../../validators/isBeforeConstraint.validator'
import { IsAfterConstraint } from '../../validators/isAfterConstraint.validator'
import { VacationRequest } from '../entities/vacation-request.entity'

@InputType()
export class CreateVacationRequestInput extends VacationRequest {
  @IsDate()
  @MinDate(new Date())
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  @Validate(IsBeforeConstraint, ['endDate'])
  @Field({ nullable: false })
  startDate: Date

  @IsDate()
  @MinDate(new Date())
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  @Validate(IsAfterConstraint, ['startDate'])
  @Field({ nullable: false })
  endDate: Date
}
