import { Injectable } from '@nestjs/common'
import { CreateLoanableMaterialInput } from './dto/create-loanable-material.input'
import { UpdateLoanableMaterialInput } from './dto/update-loanable-material.input'
import { InjectRepository } from '@nestjs/typeorm'
import { LoanableMaterial } from './entities/loanable-material.entity'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { ObjectId } from 'mongodb'

@Injectable()
export class LoanableMaterialsService {
  constructor(
    @InjectRepository(LoanableMaterial)
    private readonly LoanableMaterialRepository: Repository<LoanableMaterial>
  ) {}

  findAll() {
<<<<<<< HEAD
    // Get all loanableMaterials
=======
>>>>>>> 42-rooms
    return this.LoanableMaterialRepository.find()
  }

  create(
    CreateLoanableMaterialInput: CreateLoanableMaterialInput
  ): Promise<LoanableMaterial> {
    const LM = new LoanableMaterial()
    LM.name = CreateLoanableMaterialInput.name
    LM.totalAmount = CreateLoanableMaterialInput.totalAmount
    LM.wantedAmount = CreateLoanableMaterialInput.wantedAmount
    LM.price = CreateLoanableMaterialInput.price
    LM.isComplete = CreateLoanableMaterialInput.isComplete
    LM.description = CreateLoanableMaterialInput.description

    console.log('Created: ' + LM.name)

    return this.LoanableMaterialRepository.save(LM)
  }

  findOneById(id: string): Promise<LoanableMaterial> {
    const obj = new ObjectId(id)
    console.log(obj)
    // @ts-ignore
    return this.LoanableMaterialRepository.findOne({ _id: new ObjectId(id) })
  }

  async update(
    id: string,
    updateLoanableMaterialInput: UpdateLoanableMaterialInput
  ) {
    const lm = await this.findOneById(id)
    lm.name = updateLoanableMaterialInput.name
    lm.totalAmount = updateLoanableMaterialInput.totalAmount
    lm.wantedAmount = updateLoanableMaterialInput.wantedAmount
    lm.price = updateLoanableMaterialInput.price
    lm.sports = updateLoanableMaterialInput.sports
    lm.isComplete = updateLoanableMaterialInput.isComplete
    lm.description = updateLoanableMaterialInput.description
    return this.LoanableMaterialRepository.save(lm)
  }

  save(loanableMaterials: LoanableMaterial[]): Promise<LoanableMaterial[]> {
    return this.LoanableMaterialRepository.save(loanableMaterials)
  }

  remove(id: string): Promise<String> {
    return this.LoanableMaterialRepository.delete(id)
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  }

  truncate(): Promise<void> {
    return this.LoanableMaterialRepository.clear()
  }
}
