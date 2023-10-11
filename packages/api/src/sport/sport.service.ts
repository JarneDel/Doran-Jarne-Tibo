// Common
import { Injectable } from '@nestjs/common'
// Input
import { CreateSportInput } from './dto/create-sport.input'
import { UpdateSportInput } from './dto/update-sport.input'
// MongoDB
import { ObjectId } from 'mongodb'
// TypeOrm
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
// Entities
import { Sport } from './entities/sport.entity'

@Injectable()
export class SportService {
  constructor(
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>
  ) {}
  create(createSportInput: CreateSportInput) {
    const s = new Sport()
    const { name } = createSportInput
    s.name = name
    return this.sportRepository.save(s)
  }

  findAll() {
    return this.sportRepository.find()
  }

  findOneById(id: string): Promise<Sport> {
    const obj = new ObjectId(id)
    console.log(obj)
    // @ts-ignore
    return this.sportRepository.findOne({ _id: new ObjectId(id) })
  }

  async update(id: string, updateSportInput: UpdateSportInput) {
    const s = await this.findOneById(id)
    s.name = updateSportInput.name
    return this.sportRepository.save(s)
  }

  remove(id: string): Promise<string> {
    return this.sportRepository
      .delete(id)
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  }

  // logic for seeding
  save(sportItems: Sport[]): Promise<Sport[]> {
    return this.sportRepository.save(sportItems)
  }
  truncate(): Promise<void> {
    return this.sportRepository.clear()
  }
}
