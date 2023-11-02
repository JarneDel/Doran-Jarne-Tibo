import { Injectable } from '@nestjs/common';
import { CreateVacationRequestInput } from './dto/create-vacation-request.input';
import { UpdateVacationRequestInput } from './dto/update-vacation-request.input';

@Injectable()
export class VacationRequestService {
  create(createVacationRequestInput: CreateVacationRequestInput) {
    return 'This action adds a new vacationRequest';
  }

  findAll() {
    return `This action returns all vacationRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vacationRequest`;
  }

  update(id: number, updateVacationRequestInput: UpdateVacationRequestInput) {
    return `This action updates a #${id} vacationRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacationRequest`;
  }
}
