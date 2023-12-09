import { Sport } from './sportInterface'

export interface material {
  id: string
  name: string
  totalAmount: number
  wantedAmount: number
  price: number
  sports: Sport[]
  isComplete: boolean
  description: string
  amountReserved: number
}
