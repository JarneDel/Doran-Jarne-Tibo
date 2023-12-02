import { StaffShort } from '@/interface/staff.interface.ts'

export interface VacationRequest {
  id: string
  isApproved: boolean
  isRejected: boolean
  rejectReason: string
  createdAt: Date
  updatedAt: Date
  startDate: Date
  endDate: Date
}

export interface VacationRequestWithStaff extends VacationRequest {
  staff: StaffShort
}

export interface VacationRequestedSubscription {
  count: number
  type?: string
  fromUid?: string
  fromName?: string
}
