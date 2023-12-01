import { Injectable } from '@nestjs/common'
import { CreateStaffInput } from './dto/create-staff.input'
import { UpdateStaffInput } from './dto/update-staff.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Staff } from './entities/staff.entity'
import { FilterOperators, MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { Role } from 'src/users/entities/user.entity'
import { GraphQLError } from 'graphql/error'

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: MongoRepository<Staff>,
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

  /**
   * This method is used to create a new staff member from a staff register with email.
   * If no staff member exists, it saves the new staff member to the repository.
   *
   * @param {Staff} staffRegister - The staff register object from which to create the new staff member.
   * @returns  The newly created staff member.
   * @throws {GraphQLError} - Throws an error if a staff member with the same email or UID already exists.
   */
  async createFromStaffRegister(staffRegister: Staff) {
    const options: FilterOperators<Staff> = {
      $or: [{ email: staffRegister.email }, { UID: staffRegister.UID }],
    }
    const existingStaff = await this.staffRepository.find(options)
    if (existingStaff.length > 0) {
      throw new GraphQLError('Staff already exists')
    }

    staffRegister.holidayDates = []

    return this.staffRepository.save(staffRegister)
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

  findByUIDs(uIds: string[]): Promise<Staff[]> {
    return this.staffRepository.find({
      //@ts-ignore
      UID: { $in: uIds },
    })
  }

  find(ids: string[]): Promise<Staff[]> {
    return this.staffRepository.find({
      //@ts-ignore
      _id: { $in: ids.map(id => new ObjectId(id)) },
    })
  }

  async update(id: string, updateStaffInput: UpdateStaffInput) {
    const s = await this.findOne(id)
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
    return this.staffRepository.save(s)
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

  async updateProfilePictureUrl(uid: string, profilePictureUrl: string) {
    try {
      const url = new URL(profilePictureUrl)
      url.protocol = 'https'
      profilePictureUrl = url.toString()

      const user = await this.staffRepository.findOneByOrFail({ UID: uid })
      return this.staffRepository.merge(user, { profilePictureUrl })
    } catch (e) {
      if (e instanceof TypeError) {
        throw new GraphQLError('Invalid URL')
      }
      throw e
    }
    // return user
  }

  async saveVacation(uid: string, startDate: Date, endDate: Date) {
    const staff = await this.findOneByUid(uid)
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
    )
    if (days > staff.holidaysLeft) {
      throw new GraphQLError('Not enough holidays left')
    }
    staff.holidaysLeft -= days
    for (let i = 0; i < days; i++) {
      if (staff.holidayDates.includes(startDate)) {
        throw new GraphQLError('Already on holiday')
      }
      staff.holidayDates.push(startDate)
      startDate = new Date(startDate.getTime() + 1000 * 3600 * 24)
    }

    return this.staffRepository.save(staff)
  }

  async removeVacation(uid: string, startDate: Date, endDate: Date) {
    const staff = await this.findOneByUid(uid)
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
    )
    staff.holidaysLeft += days
    for (let i = 0; i < days; i++) {
      const index = staff.holidayDates.findIndex(date => {
        return date.getTime() === startDate.getTime()
      })
      if (index === -1) {
        throw new GraphQLError('Not on holiday')
      }
      staff.holidayDates.splice(index, 1)
      startDate = new Date(startDate.getTime() + 1000 * 3600 * 24)
    }

    return this.staffRepository.save(staff)
  }
}
