import { Injectable } from '@nestjs/common'
import { StaffRegister } from './entities/staff-register.entity'
import { MongoRepository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class StaffRegisterService {
  constructor(
    @InjectRepository(StaffRegister)
    private readonly staffRegisterRepository: MongoRepository<StaffRegister>,
  ) {}

  async create(staffRegister: StaffRegister) {
    return this.staffRegisterRepository.save(staffRegister)
  }
}
