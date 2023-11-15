import { material } from "./materialInterface"
import { Room } from "./roomInterface"

export interface Reservation {
  createdAt: string
  date: string
  endTime: string
  group: {
    __typename: string
    id: string
    UID: string
    locale: string
    role: string
    // Add other properties here as needed
  }
  id: string
  isCancelled: boolean
  price: number
  reservedMaterials: material[] // You can specify the actual type here
  rooms: Room[]
  startTime: string
  updatedAt: string
  __typename: string
}
