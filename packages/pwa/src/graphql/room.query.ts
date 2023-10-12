import gql from 'graphql-tag'

export const ALL_ROOMS = gql`
query{
    GetAllRooms{
      id
      name
      sports
      pricePerHour
      type
    }
  }
`

export const GET_ROOM_BY_ID = gql`
query {
  GetRoomById(
    $id: String!
  ) {
    id
    name
    sports
    pricePerHour
    type
  }
}
`