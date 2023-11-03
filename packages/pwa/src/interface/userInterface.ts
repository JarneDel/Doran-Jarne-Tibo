export interface User {
  userByUid: {
    __typename: string
    id: string
    uid: string
    locale: string
    role: string
    name: string
    btwNumber: string
    score: number
    firstName: string
    lastName: string
    email: string
    phone: string
    holidaysLeft: number
    holidayDates: Date[]
  }
}
