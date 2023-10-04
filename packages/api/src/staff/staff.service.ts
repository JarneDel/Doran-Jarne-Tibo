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
    return this.staffRepository.find()
  }

  findOne(id: Object) {
    return this.staffRepository.findOneByOrFail({
      //@ts-ignore
      _id: new Object(id),
    })
  }

  update(id: string, updateStaffInput: UpdateStaffInput) {
    return this.staffRepository.update(id, updateStaffInput)
  }

  remove(id: number) {
    return `This action removes a #${id} staff`
  }

  saveAll(staffItems: Staff[]): Promise<Staff[]> {
    return this.staffRepository.save(staffItems)
  }

  truncate(): Promise<void> {
    return this.staffRepository.clear()
  }
}
