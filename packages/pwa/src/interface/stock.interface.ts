import { ServiceItem } from '@/interface/service.interface.ts'

export interface IUpdateItemOptional {
  amountInStock?: number
  description?: string
  idealStock?: number
  name?: string
  needToOrderMore?: boolean
  serviceId?: string
}

export interface IUpdateStock {
  // input UpdateStockInput {
  amountInStock: number
  description: string
  id: string
  idealStock: number
  name: string
  needToOrderMore: boolean
  serviceId?: string
}

export interface CreateStockInput {
  amountInStock: number
  description?: string
  idealStock?: number
  name: string
  needToOrderMore: boolean
  serviceId: string
}

export interface IOneStockItem {
  stockItem: StockItem
}

export interface StockItem {
  id: string
  name: string
  description: string
  amountInStock: number
  idealStock: number
  needToOrderMore: boolean
  service: ServiceItem
}
