import { gql, TypedDocumentNode } from '@apollo/client/core'
import {
  VacationRequest,
  VacationRequestedSubscription,
  VacationRequestWithStaff,
} from '@/interface/vacation-request.interface.ts'
import { StaffShort } from '@/interface/staff.interface.ts'

export const CREATE_VACATION_REQUEST: TypedDocumentNode<
  { createVacationRequest: VacationRequest },
  {
    input: {
      startDate: Date
      endDate: Date
    }
  }
> = gql`
  mutation CreateVacationRequest($input: CreateVacationRequestInput!) {
    createVacationRequest(createVacationRequestInput: $input) {
      id
      isApproved
      isRejected
      rejectReason
      createdAt
      updatedAt
      startDate
      endDate
    }
  }
`

export const APPROVE_VACATION_REQUEST: TypedDocumentNode<
  { approveVacationRequest: VacationRequest },
  {
    approveVacationRequestInput: {
      id: string
      isApproved: boolean
      isRejected: boolean
      rejectReason: string
    }
  }
> = gql`
  mutation ApproveVacationRequest(
    $approveVacationRequestInput: ApproveVacationRequestInput!
  ) {
    approveVacationRequest(
      approveVacationRequestInput: $approveVacationRequestInput
    ) {
      id
      isApproved
      isRejected
      rejectReason
      createdAt
      updatedAt
      startDate
      endDate
    }
  }
`

export const GET_VACATION_REQUESTS: TypedDocumentNode<{
  vacationRequestLoggedIn: VacationRequest[]
}> = gql`
  query GetVacationRequests {
    vacationRequestLoggedIn {
      id
      isApproved
      isRejected
      rejectReason
      createdAt
      updatedAt
      startDate
      endDate
    }
  }
`
export const GET_VACATION_REQUESTS_ADMIN_ALL: TypedDocumentNode<
  {
    vacationRequestsBy: VacationRequestWithStaff[]
    staff: StaffShort[]
  },
  {
    isExpired: boolean | null
    isOpen: boolean | null
    staffUId: string | null
  }
> = gql`
  query GetVacationRequestsAdminAll(
    $isExpired: Boolean
    $isOpen: Boolean
    $staffUId: String
  ) {
    vacationRequestsBy(
      isExpired: $isExpired
      isOpen: $isOpen
      staffUId: $staffUId
    ) {
      id
      isApproved
      isRejected
      rejectReason
      createdAt
      updatedAt
      startDate
      endDate
      staff {
        id
        UID
        firstName
        lastName
        email
      }
    }
    staff {
      id
      UID
      firstName
      lastName
      email
    }
  }
`

export const CANCEL_VACATION_REQUEST: TypedDocumentNode<
  { cancelVacationRequest: VacationRequest },
  { id: string }
> = gql`
  mutation CancelVacationRequest($id: String!) {
    cancelVacationRequest(id: $id) {
      id
      isApproved
      isRejected
      rejectReason
      createdAt
      updatedAt
      startDate
      endDate
    }
  }
`

export const VACATION_REQUESTED_SUBSCRIPTION: TypedDocumentNode<{
  vacationRequested: VacationRequestedSubscription
}> = gql`
  subscription VacationRequested {
    vacationRequested {
      count
      type
      fromUid
      fromName
    }
  }
`

export const VACATION_REQUESTED_COUNT: TypedDocumentNode<
  { pendingVacationRequestsCount: { count: number } },
  {}
> = gql`
  query OpenVacationRequestCount {
    pendingVacationRequestsCount {
      count
    }
  }
`

