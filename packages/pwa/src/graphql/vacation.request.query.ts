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
  startDate: Date
  endDate: Date
}

export interface CreateVacationRequest {
  createVacationRequest: VacationRequest
}

export const APPROVE_VACATION_REQUEST = gql`
  mutation ApproveVacationRequest($input: ApproveVacationRequestInput!) {
    approveVacationRequest(approveVacationRequestInput: $input) {
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
  approveVacationRequestInput: VacationRequest
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

// export const GET_VACATION_REQUESTS_ADMIN_ALL = gql`
//     query GetVacationRequestsAdminAll {
//         vacationRequest() {
//             id
//             isApproved
//             isRejected
//             rejectReason
//             createdAt
//             updatedAt
//             startDate
//             endDate
//         }
//     }
// `

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
