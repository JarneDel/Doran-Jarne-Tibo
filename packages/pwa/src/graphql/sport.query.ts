import gql from 'graphql-tag'

export const ALL_SPORTS = gql`
  query {
    GetAllSports {
      id
      name
      createdAt
      updatedAt
    }
  }
`

export const GET_SPORT = gql`
  query GetSportById($id: String!) {
    GetSportById(id: $id) {
      id
      name
      description
    }
  }
`

export const DELETE_SPORT = gql`
  mutation removeSportById($id: String!) {
    removeSportById(id: $id)
  }
`
