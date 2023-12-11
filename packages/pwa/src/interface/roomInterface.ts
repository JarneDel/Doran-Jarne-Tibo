export interface Room {
  id: string
  name: string
  sports: [{ id: string; name: string; createdAt: Date; updatedAt: Date }]
  pricePerHour: number
  type: string
  canBeUsed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Rooms {
  id: string
  name: string
  sports: [{ id: string; name: string; createdAt: Date; updatedAt: Date }]
  pricePerHour: number
  type: string
}
