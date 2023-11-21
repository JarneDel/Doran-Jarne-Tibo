export interface material {
  id: string
  name: string
  totalAmount: number
  wantedAmount: number
  price: number
  sports: [{ id: string; name: string; createdAt: Date; updatedAt: Date }]
  isComplete: boolean
  description: string
  amountReserved: number
}
