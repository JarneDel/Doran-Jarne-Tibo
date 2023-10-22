import gql from 'graphql-tag'

export const ALL_ROOMS = gql`
query{
  GetAllRooms{
    id
    name
    sports{
      id
      name
    }
    pricePerHour
    type
    createdAt
    updatedAt
  }
}
`

