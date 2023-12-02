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
    s.roomId = createServiceInput.roomId
    s.staffUID = createServiceInput.staffUID
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

  findByStaffUId(staffId: string): Promise<Service[]> {
    return this.serviceRepository.find({
      //@ts-ignore
      staffUID: { $elemMatch: { $eq: staffId } },
    })
  }

  update(id: string, updateServiceInput: UpdateServiceInput) {
    const s = new Service()
    s.name = updateServiceInput.name
    s.description = updateServiceInput.description
  }

  remove(id: string) {
    return this.serviceRepository.delete(id).then((res) => {
      return res
    }).catch((err) => {
      return err
    })
  }

  saveAll(services: Service[]): Promise<Service[]> {
    return this.serviceRepository.save(services)
  }

  truncate(): Promise<void> {
    return this.serviceRepository.clear()
  }
}
