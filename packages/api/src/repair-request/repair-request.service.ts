import { Injectable } from '@nestjs/common';
import { CreateRepairRequestInput } from './dto/create-repair-request.input';
import { UpdateRepairRequestInput } from './dto/update-repair-request.input';

@Injectable()
export class RepairRequestService {
  create(createRepairRequestInput: CreateRepairRequestInput) {
    return 'This action adds a new repairRequest';
  }

  findAll() {
    return `This action returns all repairRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} repairRequest`;
  }

  update(id: number, updateRepairRequestInput: UpdateRepairRequestInput) {
    return `This action updates a #${id} repairRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} repairRequest`;
  }
}
