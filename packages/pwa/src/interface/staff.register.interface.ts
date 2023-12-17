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
