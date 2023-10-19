import gql from 'graphql-tag'

export const ALL_GROUPS = gql`
  query {
    groups {
      id
      name
      btwNumber
      score
    }
  }
`
export const UPDATE_SCORE = gql`
  mutation updateScore($id: String!, $amount: Int!) {
    updateScore(id: $id, amount: $amount) {
      id
      name
      btwNumber
      score
    }
  }
`
