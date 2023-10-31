import { Injectable } from '@nestjs/common'
import { CreateStaffInput } from './dto/create-staff.input'
import { UpdateStaffInput } from './dto/update-staff.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Staff } from './entities/staff.entity'
import { Repository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { Role } from 'src/users/entities/user.entity'

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  create(uid: string, createStaffInput: CreateStaffInput) {
    // todo: validate input && check if staff already exists
    const s = new Staff()
    s.firstName = createStaffInput.firstName
    s.lastName = createStaffInput.lastName
    s.email = createStaffInput.email
    s.phone = createStaffInput.phone
    s.holidaysLeft = createStaffInput.holidaysLeft
    s.holidayDates = createStaffInput.holidayDates
    s.role = Role.STAFF
    s.UID = uid
    return this.staffRepository.save(s)
  }

  findAll() {
    return this.staffRepository.find()
  }

  findOne(id: string) {
    return this.staffRepository.findOneByOrFail({
      //@ts-ignore
      _id: new ObjectId(id),
    })
  }

  find(ids: string[]): Promise<Staff[]> {
    return this.staffRepository.find({
      //@ts-ignore
      _id: { $in: ids.map(id => new ObjectId(id)) },
    })
  }

  async update(id: string, updateStaffInput: UpdateStaffInput) {
    const s =await this.findOne(id)
    if (s) {
      s.firstName = updateStaffInput.firstName
      s.lastName = updateStaffInput.lastName
      s.email = updateStaffInput.email
      s.phone = updateStaffInput.phone
      if (updateStaffInput.holidaysLeft)
      s.holidaysLeft = updateStaffInput.holidaysLeft
      if (updateStaffInput.holidayDates)
      s.holidayDates = updateStaffInput.holidayDates
      s.locale = updateStaffInput.locale
    }
    return this.staffRepository.save( s)
  }

  remove(id: string) {
    return `This action removes a #${id} staff`
  }

  saveAll(staffItems: Staff[]): Promise<Staff[]> {
    return this.staffRepository.save(staffItems)
  }

  truncate(): Promise<void> {
    return this.staffRepository.clear()
  }

  async findOneByUid(uid: string) {
    //@ts-ignore
    return await this.staffRepository.findOneByOrFail({ UID: uid })
  }
}
