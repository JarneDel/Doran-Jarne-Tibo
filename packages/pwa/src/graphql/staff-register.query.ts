import { gql, type TypedDocumentNode } from '@apollo/client/core'
import {
  CreateStaffRegister,
  signUpStaffArgs,
  Staff,
  StaffRegister,
} from '@/interface/staff.register.interface.ts'

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

export const DELETE_REGISTRATION: TypedDocumentNode<boolean, { id: string }> =
  gql`
    mutation deleteStaffRegister($id: String!) {
      staffRegisterDelete(id: $id)
    }
  `
