import gql from 'graphql-tag'

export const ALL_STOCK = gql`
  query {
    stock {
      id
      name
      description
      amountInStock
      idealStock
      service
    }
  }
`
