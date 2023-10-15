// Common
import { Injectable } from '@nestjs/common';
// Inputs
import { CreateRepairRequestInput } from './dto/create-repair-request.input';
import { UpdateRepairRequestInput } from './dto/update-repair-request.input';
// Typeorm
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';
// Entities
import { RepairRequest } from './entities/repair-request.entity';

@Injectable()
export class RepairRequestService {
  constructor(
    @InjectRepository(RepairRequest)
    private readonly RepairRequestRepository: Repository<RepairRequest>
  ) {}

  create(createRepairRequestInput: CreateRepairRequestInput) {
    const RR = new RepairRequest()
    RR.UID = "Temporarily UID"
    RR.description = createRepairRequestInput.description
    RR.room = createRepairRequestInput.room
    RR.loanableMaterial = createRepairRequestInput.loanableMaterial
    console.log('Created: ' + RR.description)
    return this.RepairRequestRepository.save(RR)
  }

  findAll() {
    return this.RepairRequestRepository.find()
  }

  findOneById(id: string): Promise<RepairRequest> {
    const obj = new ObjectId(id)
    console.log(obj)
    // @ts-ignore
    return this.RepairRequestRepository.findOne({ id: new ObjectId(id) })
  }

  async update(id: string, updateRepairRequestInput: UpdateRepairRequestInput) {
    const rr = await this.findOneById(id)
    rr.description = updateRepairRequestInput.description
    rr.room = updateRepairRequestInput.room
    rr.loanableMaterial = updateRepairRequestInput.loanableMaterial
    return this.RepairRequestRepository.save(rr)
  }

  remove(id: string): Promise<String> {
    return this.RepairRequestRepository.delete(id)
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  }

  save(repairRequests: RepairRequest[]): Promise<RepairRequest[]> {
    return this.RepairRequestRepository.save(repairRequests)
  }

  truncate(): Promise<void> {
    return this.RepairRequestRepository.clear()
  }
}
