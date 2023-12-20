export interface User {
  __typename: string
  id: string
  UID: string
  locale: string
  role: string
  createdAt: string
  updatedAt: string
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  holidaysLeft?: number
  holidayDates?: string[]
  btwNumber?: string
  score?: number
  profilePictureUrl: string
}
