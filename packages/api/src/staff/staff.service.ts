import { Injectable } from '@nestjs/common'
import { CreateStaffInput } from './dto/create-staff.input'
import { UpdateStaffInput } from './dto/update-staff.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Staff } from './entities/staff.entity'
import { Repository } from 'typeorm'

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}
  create(createStaffInput: CreateStaffInput) {
    const s = new Staff()
    s.firstName = createStaffInput.firstName
    s.lastName = createStaffInput.lastName
    s.email = createStaffInput.email
    s.phone = createStaffInput.phone
    s.holidaysLeft = createStaffInput.holidaysLeft
    s.holidayDates = createStaffInput.holidayDates
    return this.staffRepository.save(s)
  }

  findAll() {
    return `This action returns all staff`
  }

  findOne(id: number) {
    return `This action returns a #${id} staff`
  }

  update(id: number, updateStaffInput: UpdateStaffInput) {
    return `This action updates a #${id} staff`
  }

  remove(id: number) {
    return `This action removes a #${id} staff`
  }
}
