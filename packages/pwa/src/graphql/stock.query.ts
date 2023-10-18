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
