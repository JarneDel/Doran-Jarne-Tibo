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

export const GET_LOANABLE_MATERIAL = gql`
query ($id: String!) {
  GetloanableMaterialById(id: $id) {
    id
    name
    price
    sports {
      id
      name
    }
    totalAmount
    wantedAmount
    isComplete
    description
  }
}
`

export const CREATE_LOANABLE_MATERIAL = gql`
mutation ($createLoanableMaterialInput: CreateLoanableMaterialInput!) {
  createLoanableMaterial(
    createLoanableMaterialInput: $createLoanableMaterialInput
  ) {
    id
    name
    totalAmount
    wantedAmount
    price
    sports{
      id
      name
    }
    isComplete
    description
  }
}
`

export const REMOVE_LOANABLE_MATERIAL = gql`
mutation ($id: String!) {
  removeLoanableMaterialById(id: $id)
}
`

export const UPDATE_LOABALE_MATERIAL = gql`
mutation ($updateLoanableMaterialInput: UpdateLoanableMaterialInput!) {
  updateLoanableMaterial(updateLoanableMaterialInput: $updateLoanableMaterialInput){
    name
  }
}
`