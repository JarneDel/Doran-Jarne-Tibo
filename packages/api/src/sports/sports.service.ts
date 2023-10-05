import { Injectable } from '@nestjs/common';
import { CreateSportInput } from './dto/create-sport.input';
import { UpdateSportInput } from './dto/update-sport.input';

@Injectable()
export class SportsService {
  create(createSportInput: CreateSportInput) {
    return 'This action adds a new sport';
  }

  findAll() {
    return `This action returns all sports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sport`;
  }

  update(id: number, updateSportInput: UpdateSportInput) {
    return `This action updates a #${id} sport`;
  }

  remove(id: number) {
    return `This action removes a #${id} sport`;
  }
}
