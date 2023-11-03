import { Injectable, NotImplementedException } from '@nestjs/common'
import { CreateVacationRequestInput } from './dto/create-vacation-request.input'
import { UpdateVacationRequestInput } from './dto/update-vacation-request.input'
import { VacationRequest } from './entities/vacation-request.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { ApproveVacationRequestInput } from './dto/approve-vacation-request.input'
import { GraphQLError } from 'graphql/error'

@Injectable()
export class VacationRequestService {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacationRequestRepository: Repository<VacationRequest>,
  ) {}

  create(
    createVacationRequestInput: CreateVacationRequestInput,
    staffUId: string,
  ) {
    const v = new VacationRequest()
    v.staffUId = staffUId
    v.startDate = new Date(createVacationRequestInput.startDate)
    v.endDate = new Date(createVacationRequestInput.endDate)
    return this.vacationRequestRepository.save(v)
  }

  approve(approveVacationRequestInput: ApproveVacationRequestInput) {

    if (
      approveVacationRequestInput.isApproved &&
      approveVacationRequestInput.isRejected
    ) {
      throw new GraphQLError('Cannot approve and reject at the same time')
    }
    if (
      !approveVacationRequestInput.isApproved &&
      !approveVacationRequestInput.isRejected
    ) {
      throw new GraphQLError('Must approve or reject')
    }
    if (
      approveVacationRequestInput.isRejected &&
      !approveVacationRequestInput.rejectReason
    ) {
      throw new GraphQLError('Must provide a reason for rejection')
    }





    const oId = new ObjectId(approveVacationRequestInput.id)
    return this.vacationRequestRepository.update(
      //@ts-ignore
      { _id: oId },
      approveVacationRequestInput,
    )
  }

  findAll() {
    return this.vacationRequestRepository.find()
  }

  findOne(id: string) {
    const oId = new ObjectId(id)
    //@ts-ignore
    return this.vacationRequestRepository.findOneByOrFail({ _id: oId })
  }

  findByStaffUId(staffId: string): Promise<VacationRequest[]> {
    return this.vacationRequestRepository.findBy({ staffUId: staffId })
  }

  update(id: number, updateVacationRequestInput: UpdateVacationRequestInput) {
    throw new NotImplementedException()
  }

  remove(id: number) {
    throw new NotImplementedException()
  }

  truncate() {
    return this.vacationRequestRepository.clear()
  }
}
