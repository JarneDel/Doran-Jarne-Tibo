import { Injectable } from '@nestjs/common'
import { CreateServiceInput } from './dto/create-service.input'
import { UpdateServiceInput } from './dto/update-service.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Service } from './entities/service.entity'
import { Repository } from 'typeorm'
import { ObjectId } from 'mongodb'

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  create(createServiceInput: CreateServiceInput) {
    const s = new Service()
    s.description = createServiceInput.description
    s.name = createServiceInput.name
    return this.serviceRepository.save(s)
  }

  findAll() {
    return this.serviceRepository.find()
  }

  findOne(id: string | ObjectId) {
    if (typeof id === 'string') id = new ObjectId(id)
    //@ts-ignore
    return this.serviceRepository.findOneByOrFail({ _id: id })
  }

  find(ids: string[]): Promise<Service[]> {
    return this.serviceRepository.find({
      //@ts-ignore
      _id: { $in: ids.map(id => new ObjectId(id)) },
    })
  }

  findByStaffId(staffId: string): Promise<Service[]> {
    return this.serviceRepository.find({
      //@ts-ignore
      staffId: { $elemMatch: { $eq: staffId } },
    })
  }

  update(id: string, updateServiceInput: UpdateServiceInput) {
    //@ts-ignore
    return this.serviceRepository.findOneByOrFail({ _id: new ObjectId(id) })
    // todo
  }

  remove(id: string) {
    return this.serviceRepository.delete(id)
  }

  saveAll(services: Service[]): Promise<Service[]> {
    return this.serviceRepository.save(services)
  }

  truncate(): Promise<void> {
    return this.serviceRepository.clear()
  }
}
