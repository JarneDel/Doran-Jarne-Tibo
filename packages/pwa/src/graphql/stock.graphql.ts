import gql from 'graphql-tag'

export const ALL_STOCK = gql`
  query {
    stock {
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
