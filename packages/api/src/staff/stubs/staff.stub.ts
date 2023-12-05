import { CreateStaffInput } from '../dto/create-staff.input'
import { Staff } from '../entities/staff.entity'
import { Role } from 'src/users/entities/user.entity'

export const createStaffInputStub = (): CreateStaffInput => {
  const staff = new CreateStaffInput()
  staff.firstName = 'Test'
  staff.lastName = 'Test'
  staff.email = 'Test.test@test.test'
  staff.phone = '123456789'
  staff.holidaysLeft = 20
  staff.holidayDates = [new Date()]
  return staff
}

export const staffStub = (): Staff => {
  const staff = new Staff()
  staff.id = 'abc123'
  staff.firstName = 'Test'
  staff.lastName = 'Test'
  staff.email = 'Test.test@test.test'
  staff.phone = '123456789'
  staff.holidaysLeft = 20
  staff.holidayDates = [new Date()]
  staff.UID = 'abc123'
  staff.role = Role.SUPER_ADMIN
  return staff
}
