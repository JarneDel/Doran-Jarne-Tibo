import { gql, type TypedDocumentNode } from '@apollo/client/core'

export const STAFF_REGISTER_BY_ID: TypedDocumentNode<
  { staffRegisterById: StaffRegister },
  { id: string }
> = gql`
  query staffRegisterById($id: String!) {
    staffRegisterById(id: $id) {
      id
      email
      firstName
      lastName
      isRegistered
      role
      expiresAt
    }
  }
`

export const STAFF_COMPLETE_REGISTRATION: TypedDocumentNode<
  { signUpUser: Staff },
  { staffSignUpInput: signUpStaffArgs }
> = gql`
  mutation signUpUser($staffSignUpInput: StaffSignUpInput!) {
    signUpUser(staffSignUpInput: $staffSignUpInput) {
      id
      UID
      locale
      role
      createdAt
      updatedAt
      profilePictureUrl
      firstName
      lastName
      email
      phone
      holidaysLeft
      holidaysTotal
      holidayDates
    }
  }
`

export const ALL_REGISTRATIONS: TypedDocumentNode<{
  staffRegisterAll: StaffRegister[]
}> = gql`
  query staffRegister {
    staffRegisterAll {
      id
      email
      firstName
      lastName
      isRegistered
      role
      expiresAt
      holidayCount
    }
  }
`
export const CREATE_REGISTRATION: TypedDocumentNode<
  { staffRegister: StaffRegister },
  { staffRegisterInput: CreateStaffRegister }
> = gql`
  mutation staffRegister($staffRegisterInput: CreateStaffRegisterInput!) {
    createStaffRegister(createStaffRegisterInput: $staffRegisterInput) {
      id
      email
      firstName
      lastName
      isRegistered
      role
      expiresAt
    }
  }
`

export interface CreateStaffRegister {
  email: string
  firstName: string
  holidayCount?: number
  lastName: string
  role: string
}

export interface StaffRegister {
  id: string
  email: string
  firstName: string
  lastName: string
  isRegistered: boolean
  role: string
  expiresAt: Date
}

export interface signUpStaffArgs {
  locale: string
  id: string
  uid: string
  phone: string
}

export interface Staff {
  id: string
  UID: string
  locale: string
  role: string
  createdAt: Date
  updatedAt: Date
  profilePictureUrl: string
  firstName: string
  lastName: string
  email: string
  phone: string
  holidaysLeft: number
  holidaysTotal: number
  holidayDates: Date[]
}
