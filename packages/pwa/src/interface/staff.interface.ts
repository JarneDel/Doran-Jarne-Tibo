export interface StaffShort {
  id: string
  UID: string
  firstName: string
  lastName: string
  email: string
}

export interface StaffBasics {
  id: string
  UID: string
  locale: string
  role: string
  profilePictureUrl: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface StaffMember {
  UID: string
  createdAt: Date
  email: string
  firstName: string
  holidayDates: Date[]
  holidaysLeft: number
  holidaysTotal: number
  role: string
  id: string
  lastName: string
  phone: string
  profilePictureUrl: string
  workingHours: {
    day: number
    endTime: string
    startTime: string
  }[]
}

export interface Staff {
  __typename?: string
  id: string
  UID: string
  locale: string
  role: string
  createdAt: string
  updatedAt: string
  firstName: string
  lastName: string
  email: string
  phone: string
  holidaysLeft: number
  holidaysTotal: number
  holidayDates: string[]
  profilePictureUrl: string
}
