import { Injectable } from '@nestjs/common'
import { CreateLoanableMaterialInput } from './dto/create-loanable-material.input'
import { UpdateLoanableMaterialInput } from './dto/update-loanable-material.input'
import { InjectRepository } from '@nestjs/typeorm'
import { LoanableMaterial } from './entities/loanable-material.entity'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { ObjectId } from 'mongodb'
import { ReservationService } from 'src/reservation/reservation.service'

@Injectable()
export class LoanableMaterialsService {
  constructor(
    @InjectRepository(LoanableMaterial)
    private readonly LoanableMaterialRepository: Repository<LoanableMaterial>,
    private readonly reservationService: ReservationService,
  ) {}

  findAll() {
    // Get all loanableMaterials
    return this.LoanableMaterialRepository.find()
  }

  create(
    CreateLoanableMaterialInput: CreateLoanableMaterialInput,
  ): Promise<LoanableMaterial> {
    const LM = new LoanableMaterial()
    LM.name = CreateLoanableMaterialInput.name
    LM.totalAmount = CreateLoanableMaterialInput.totalAmount
    LM.wantedAmount = CreateLoanableMaterialInput.wantedAmount
    LM.price = CreateLoanableMaterialInput.price
    LM.isComplete = CreateLoanableMaterialInput.isComplete
    LM.description = CreateLoanableMaterialInput.description
    LM.SportId = CreateLoanableMaterialInput.SportId

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
    updateLoanableMaterialInput: UpdateLoanableMaterialInput,
  ) {
    const lm = await this.findOneById(id)
    lm.name = updateLoanableMaterialInput.name
    lm.totalAmount = updateLoanableMaterialInput.totalAmount
    lm.wantedAmount = updateLoanableMaterialInput.wantedAmount
    lm.price = updateLoanableMaterialInput.price
    lm.SportId = updateLoanableMaterialInput.SportId
    lm.isComplete = updateLoanableMaterialInput.isComplete
    lm.description = updateLoanableMaterialInput.description
    return this.LoanableMaterialRepository.save(lm)
  }

  save(loanableMaterials: LoanableMaterial[]): Promise<LoanableMaterial[]> {
    return this.LoanableMaterialRepository.save(loanableMaterials)
  }

  remove(id: string): Promise<String> {
    return this.LoanableMaterialRepository.delete(id)
      .then(res => {
        return res
      })
      .catch(err => {
        return err
      })
  }

  truncate(): Promise<void> {
    return this.LoanableMaterialRepository.clear()
  }

  async getAvailableMaterail(
    date: string,
    startTime: string,
    endTime: string,
    SportId: string[],
  ): Promise<LoanableMaterial[]> {
    const materials = (await this.findAll()).filter(material => {
      return SportId.includes(material.SportId.toString())
    }) as unknown as LoanableMaterial[]

    const availableRooms: LoanableMaterial[] = []
    const resurveDate = new Date(date)
    const reservations = await this.reservationService.findByDate(resurveDate)
    //remove :
    const start = new Date(date + ' ' + startTime)
    const end = new Date(date + ' ' + endTime)
    for (const material of materials) {
      let isAvailable = true
      let overMaterial = material.totalAmount
      for (const reservation of reservations) {
        for (const resMat of reservation.reservedMaterials) {
          //check if the material is reserved
          if (resMat.id.toString() === material.id.toString()) {
            //check if the reservation is in the time
            let reservationStart = new Date(date + ' ' + reservation.startTime)
            let reservationEnd = new Date(date + ' ' + reservation.endTime)
            if (
              (start < reservationStart && end > reservationStart) ||
              (start < reservationEnd && end > reservationEnd) ||
              (reservationStart < start &&
                reservationStart < end &&
                reservationEnd > end)
            ) {
              console.log('🌈🌈')
              overMaterial = overMaterial - resMat.amountReserved
              if (overMaterial < 0) {
                isAvailable = false
              }
            }
          }
        }
      }
      if (isAvailable) {
        console.log(material.totalAmount)
        material.totalAmount = overMaterial
        console.log(overMaterial)
        console.log(material.totalAmount)
        availableRooms.push(material)
      }
    }

    return availableRooms
  }
}
