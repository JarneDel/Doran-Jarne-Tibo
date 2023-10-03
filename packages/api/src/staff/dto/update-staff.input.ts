import { CreateStaffInput } from './create-staff.input'
import { PartialType } from '@nestjs/mapped-types'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateStaffInput extends PartialType(CreateStaffInput) {
  @Field()
  id: string
}
