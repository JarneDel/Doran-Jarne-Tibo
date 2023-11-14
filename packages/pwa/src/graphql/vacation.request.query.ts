import gql from 'graphql-tag'

export const CREATE_VACATION_REQUEST = gql`
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

export interface CreateVacationRequestInput {
  input: {
    startDate: Date
    endDate: Date
  }
}

export interface CreateVacationRequest {
  createVacationRequest: VacationRequest
}

export const APPROVE_VACATION_REQUEST = gql`
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

export interface ApproveVacationRequestInput {
  approveVacationRequestInput: {
    id: string
    isApproved: boolean
    isRejected: boolean
    rejectReason: string
  }
}

export interface ApproveVacationRequestResult {
  approveVacationRequest: VacationRequest
}

export const GET_VACATION_REQUESTS = gql`
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

export interface VacationRequestQuery {
  vacationRequestLoggedIn: VacationRequest[]
}

export const GET_VACATION_REQUESTS_ADMIN = gql`
  query GetVacationRequestsAdmin($staffUId: String!) {
    vacationRequestByStaff(staffId: $staffUId) {
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

export interface VacationRequestQueryAdmin {
  vacationRequestByStaff: VacationRequest[]
}

export const GET_VACATION_REQUESTS_ADMIN_ALL = gql`
  query GetVacationRequestsAdminAll($isExpired: Boolean, $isOpen: Boolean) {
    vacationRequestsBy(isExpired: $isExpired, isOpen: $isOpen) {
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
        firstName
        lastName
        email
      }
    }
  }
`

export interface VacationRequestQueryAdminAll {
  vacationRequestsBy: VacationRequestWithStaff[]
}

export interface VacationRequestQueryAdminAllVariables {
  isExpired: boolean | null
  isOpen: boolean | null
}

export const CANCEL_VACATION_REQUEST = gql`
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
  staff: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}
