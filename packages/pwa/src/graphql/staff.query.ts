import gql from 'graphql-tag'

export const STAFF_BY_UID = gql`
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
    }
  }
`
export interface StaffMemberQuery {
  staffByUid: StaffMember
}

export interface StaffMember {
  UID: string
  createdAt: Date
  email: string
  firstName: string
  holidayDates: Date[]
  holidaysLeft: number
  id: string
  lastName: string
  phone: string
}
