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
    service {
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

export interface AllStockAndServices {
  stock: StockItem[]
  service: ServiceItem[]
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
