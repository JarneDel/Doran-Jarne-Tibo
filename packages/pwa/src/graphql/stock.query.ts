import gql from 'graphql-tag'

export const ALL_STOCK_AND_SERVICES = gql`
  query (
    $orderByField: String
    $orderDirection: String
    $searchName: String
    $searchServiceId: String
  ) {
    stock(
      orderByField: $orderByField
      orderDirection: $orderDirection
      searchName: $searchName
      searchServiceId: $searchServiceId
    ) {
      id
      name
      description
      amountInStock
      idealStock
      needToOrderMore
      service {
        id
        name
        description
      }
    }
    services {
      id
      name
    }
  }
`

export const ONE_STOCK = gql`
  query ($id: String!) {
    stockItem(id: $id) {
      id
      name
      description
      amountInStock
      idealStock
      service {
        id
        name
        description
      }
    }
  }
`

export const CREATE_STOCK = gql`
  mutation ($createStockInput: CreateStockInput!) {
    createStock(createStockInput: $createStockInput) {
      id
      service {
        id
        name
        description
      }
      name
      amountInStock
      idealStock
      description
      needToOrderMore
    }
  }
`

export const UPDATE_STOCK = gql`
  mutation ($updateStockInput: UpdateStockInput!) {
    updateStock(updateStockInput: $updateStockInput) {
      id
    }
  }
`

export const getUpdatedStockItem = (
  item: StockItem,
  update: IUpdateItemOptional,
): IUpdateStock => {
  let updatedItem: IUpdateStock = {
    id: item.id,
    amountInStock: item.amountInStock,
    description: item.description,
    idealStock: item.idealStock,
    name: item.name,
    needToOrderMore: item.needToOrderMore,
    serviceId: item.service.id,
  }
  return { ...updatedItem, ...update }
}

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

export interface ICreateStock {
  createStock: {
    id: string
  }
}

export interface AllStockAndServices {
  stock: StockItem[]
  services: ServiceItem[]
}

export interface IOneStockItem {
  stockItem: StockItem
}

export interface ServiceItem {
  id: string
  name: string
  description: string
}

export interface StockItem {
  id: string
  name: string
  description: string
  amountInStock: number
  idealStock: number
  needToOrderMore: boolean
  service: {
    id: string
    name: string
    description: string
  }
}

export interface CreateStockInput {
  amountInStock?: number
  description: String
  idealStock: number
  name: string
  needToOrderMore: boolean
  serviceId: string
}
