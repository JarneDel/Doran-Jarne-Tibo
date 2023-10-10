import gql from 'graphql-tag'

export const ALL_STOCK = gql`
  query ($orderByField: String, $orderDirection: String, $searchName: String) {
    stock(
      orderByField: $orderByField
      orderDirection: $orderDirection
      searchName: $searchName
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
  }
`

export interface AllStock {
  stock: StockItem[]
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
