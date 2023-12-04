import { gql, TypedDocumentNode } from '@apollo/client/core'
import {
  Service,
  StaffBasics,
  StaffMember,
} from '@/interface/staff.interface.ts'

export const ALL_STAFF: TypedDocumentNode<{ staff: StaffBasics[] }> = gql`
  query {
    staff {
      id
      UID
      locale
      role
      profilePictureUrl
      firstName
      lastName
      email
      phone
    }
  }
`

export const STAFF_AND_SERVICES_BY_UID: TypedDocumentNode<{
  staffByUid: StaffMember
  servicesByStaff: Service[]
}> = gql`
  query {
    staffByUid {
      UID
      id
      email
      phone
      firstName
      lastName
      holidayDates
      holidaysLeft
      holidaysTotal
      workingHours {
        day
        endTime
        startTime
      }
    }
    servicesByStaff {
      id
      description
      name
      rooms {
        name
        id
      }
      staff {
        firstName
        lastName
        id
      }
    }
  }
`
export const STAFF: TypedDocumentNode<{
  staffByUid: StaffMember
}> = gql`
  query {
    staffByUid {
      UID
      id
      email
      phone
      firstName
      lastName
      holidayDates
      holidaysLeft
      holidaysTotal
      workingHours {
        day
        endTime
        startTime
      }
    }
  }
`

export interface Staff {
  staffByUid: StaffMember
}

export const UPDATE_PROFILE_PICTURE_STAFF: TypedDocumentNode<
  {
    updateGroupProfilePictureUrl: {
      profilePictureUrl: string
      id: string
    }
  },
  { profilePictureUrl: string }
> = gql`
  mutation updateProfilePictureStaff($profilePictureUrl: String!) {
    updateStaffProfilePictureUrl(ProfilePictureUrl: $profilePictureUrl) {
      profilePictureUrl
      id
    }
  }
`
