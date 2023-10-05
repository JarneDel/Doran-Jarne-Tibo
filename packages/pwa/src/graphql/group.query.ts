import gql from 'graphql-tag'

export const ALL_GROUPS = gql`
  query {
    groups {
      _id
      name
      btw_number
      score
    }
  }
`
export const UPDATE_SCORE = gql`
  mutation updateScore($id: String!, $amount: Int!) {
    updateScore(id: $id, amount: $amount) {
      _id
      name
      btw_number
      score
    }
  }
`
