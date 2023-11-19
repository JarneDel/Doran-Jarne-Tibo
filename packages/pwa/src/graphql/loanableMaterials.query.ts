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

export const UPDATE_LOABALE_MATERIAL = gql`
mutation ($updateLoanableMaterialInput: UpdateLoanableMaterialInput!) {
  updateLoanableMaterial(updateLoanableMaterialInput: $updateLoanableMaterialInput) {
    id
    name
    totalAmount
    wantedAmount
    price
    sports
    isComplete
    description
  }
}
`