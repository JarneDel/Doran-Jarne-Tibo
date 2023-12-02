export interface StaffShort {
  id: string
  UID: string
  firstName: string
  lastName: string
  email: string
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
