import gql from 'graphql-tag'

export const ALL_SPORTS = gql`
query{
    GetAllSports{
      id
      name
      createdAt
      updatedAt
    }
  }
`