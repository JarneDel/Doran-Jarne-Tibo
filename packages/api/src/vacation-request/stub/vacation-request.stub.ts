import { CreateVacationRequestInput } from '../dto/create-vacation-request.input'
import { VacationRequest } from '../entities/vacation-request.entity'

export const createVacationRequestStub = (): CreateVacationRequestInput => {
  const vacationRequest = new CreateVacationRequestInput()
  vacationRequest.startDate = new Date()
  vacationRequest.endDate = new Date(
    new Date().setDate(new Date().getDate() + 1),
  )
  return vacationRequest
}

export const VacationRequestStub = () => {
  const vacationRequest = new VacationRequest()
  vacationRequest.startDate = new Date()
  vacationRequest.endDate = new Date()
  vacationRequest.staffUId = '60d6c7f9f9c1a1492c4c2b1b'
  return vacationRequest
}
