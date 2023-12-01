import { Injectable } from '@nestjs/common'
import { StaffRegister } from './entities/staff-register.entity'
import { MongoRepository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId } from 'mongodb'

@Injectable()
export class StaffRegisterService {
  constructor(
    @InjectRepository(StaffRegister)
    private readonly staffRegisterRepository: MongoRepository<StaffRegister>,
  ) {}

  async create(staffRegister: StaffRegister) {
    // send email to user

    return this.staffRegisterRepository.save(staffRegister)
  }

  async findAll() {
    return this.staffRegisterRepository.find()
  }

  async findOne(id: string) {
    const mongoId = new ObjectId(id)
    return this.staffRegisterRepository.findOne({
      where: {
        _id: mongoId,
      },
    })
  }

  async findOneByEmail(email: string) {
    return this.staffRegisterRepository.findOne({
      where: {
        email,
      },
    })
  }

  async update(staffRegister: StaffRegister) {
    return this.staffRegisterRepository.save(staffRegister)
  }
}
