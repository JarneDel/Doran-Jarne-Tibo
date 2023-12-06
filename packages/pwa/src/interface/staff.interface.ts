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
