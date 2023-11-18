import gql from 'graphql-tag'

export const ALL_LOANABLE_MATERIALS = gql`
query {
    GetAllLoanableMaterials {
      id
      name
      totalAmount
      wantedAmount
      price
      sports{
        id
        name
        createdAt
        updatedAt
      }
      isComplete
      description
    }
  }
`