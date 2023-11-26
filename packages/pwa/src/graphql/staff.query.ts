import gql from 'graphql-tag'

export const STAFF_AND_SERVICES_BY_UID = gql`
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
export const STAFF = gql`
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

export const UPDATE_PROFILE_PICTURE_STAFF = gql`
  mutation updateProfilePictureStaff($profilePictureUrl: String!) {
    updateStaffProfilePictureUrl(ProfilePictureUrl: $profilePictureUrl) {
      profilePictureUrl
      id
    }
  }
`

export interface UpdateProfilePictureStaff {
  updateGroupProfilePictureUrl: {
    profilePictureUrl: string
    id: string
  }
}

export interface StaffMemberQuery {
  staffByUid: StaffMember
  servicesByStaff: Service[]
}

export interface Service {
  id: string
  description: string
  name: string
  rooms: {
    name: string
    id: string
  }[]
  staff: {
    firstName: string
    lastName: string
    id: string
  }[]
}

export interface StaffMember {
  UID: string
  createdAt: Date
  email: string
  firstName: string
  holidayDates: Date[]
  holidaysLeft: number
  holidaysTotal: number
  id: string
  lastName: string
  phone: string
  workingHours: {
    day: number
    endTime: string
    startTime: string
  }[]
}
