import { Injectable } from '@nestjs/common'
import { CreateVacationRequestInput } from './dto/create-vacation-request.input'
import { VacationRequest } from './entities/vacation-request.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { MongoRepository } from 'typeorm'
import { ObjectId } from 'mongodb'
import { ApproveVacationRequestInput } from './dto/approve-vacation-request.input'
import { GraphQLError } from 'graphql/error'
import { StaffService } from '../staff/staff.service'

@Injectable()
export class VacationRequestService {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacationRequestRepository: MongoRepository<VacationRequest>,
    private readonly staffService: StaffService,
  ) {}

  async create(
    createVacationRequestInput: CreateVacationRequestInput,
    staffUId: string,
  ) {
    // check if a vacation request already exists for this time period that is not rejected
    const [existingVacationRequests, staff] = await Promise.all([
      this.checkVacationDays(createVacationRequestInput, staffUId),
      this.staffService.findOneByUid(staffUId),
    ])

    if (existingVacationRequests.length > 0) {
      throw new GraphQLError(
        'Vacation request already exists for this time period',
      )
    }

    console.log({ existingVacationRequests })

    const vacationDays = staff.holidaysLeft
    const startDate = new Date(createVacationRequestInput.startDate)
    const endDate = new Date(createVacationRequestInput.endDate)
    const daysRequested = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
    )
    if (daysRequested > vacationDays) {
      throw new GraphQLError('Not enough vacation days left')
    }
    const v = new VacationRequest()
    v.staffUId = staffUId
    v.startDate = startDate
    v.endDate = endDate
    return this.vacationRequestRepository.save(v)
  }

  async approve(approveVacationRequestInput: ApproveVacationRequestInput) {
    console.log(approveVacationRequestInput)
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

    const vacationRequest = await this.findOne(approveVacationRequestInput.id)
    if (vacationRequest.isApproved || vacationRequest.isRejected) {
      throw new GraphQLError('Vacation request has already been processed')
    }

    if (approveVacationRequestInput.isApproved) {
      console.log('approved')
      try {
        await this.staffService.saveVacation(
          vacationRequest.staffUId,
          vacationRequest.startDate,
          vacationRequest.endDate,
        )
      } catch (e) {
        if (e instanceof GraphQLError) {
          if (e.message === 'Not enough holidays left') {
            console.log('Not enough vacation days left, denying request')
            approveVacationRequestInput.isApproved = false
            approveVacationRequestInput.isRejected = true
            approveVacationRequestInput.rejectReason =
              'Not enough vacation days left'
          } else {
            throw e
          }
        }
      }
    }

    console.log('saving', approveVacationRequestInput)
    vacationRequest.isApproved = approveVacationRequestInput.isApproved
    vacationRequest.isRejected = approveVacationRequestInput.isRejected
    vacationRequest.rejectReason = approveVacationRequestInput.rejectReason
    const res = await this.vacationRequestRepository.save(vacationRequest)
    console.log(res)
    return res
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

  async cancel(id: string, staffUId: string) {
    const oId = new ObjectId(id)
    const v = await this.vacationRequestRepository
      // @ts-ignore
      .findOneByOrFail({ _id: oId, staffUId: staffUId })

    if (v.isApproved) {
      // add back vacation days
      await this.staffService.removeVacation(staffUId, v.startDate, v.endDate)
    }
    v.isApproved = false
    v.isRejected = true
    v.rejectReason = 'Cancelled by staff member'
    return this.vacationRequestRepository.save(v)
  }

  truncate() {
    return this.vacationRequestRepository.clear()
  }

  private checkVacationDays(
    createVacationRequestInput: CreateVacationRequestInput,
    staffUId: string,
  ) {
    return this.vacationRequestRepository.find({
      where: {
        $and: [
          {
            $or: [
              {
                startDate: {
                  $gte: new Date(createVacationRequestInput.startDate),
                  $lte: new Date(createVacationRequestInput.endDate),
                },
              },
              {
                endDate: {
                  $gte: new Date(createVacationRequestInput.startDate),
                  $lte: new Date(createVacationRequestInput.endDate),
                },
              },
            ],
          },
          {
            $or: [{ isRejected: false }, { isRejected: null }],
          },
          {
            staffUId: staffUId,
          },
        ],
      },
    })
  }
}
