export interface ServiceItem {
  id: string
  name: string
  description: string
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
