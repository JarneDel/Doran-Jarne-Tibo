import { CreateStaffInput } from './create-staff.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateStaffInput extends PartialType(CreateStaffInput) {
  id: number;
}
