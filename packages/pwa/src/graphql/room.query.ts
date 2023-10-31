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

export const GET_AVAILABLE_ROOMS= gql`
query getAvailableRooms($date:String! $startTime:String! $endTime:String!){
  getAvailableRooms(date:$date , startTime: $startTime, endTime:$endTime) {
    id
    name
    sports {
      id
      name
      createdAt
      updatedAt
    }
    pricePerHour
    type
    canBeUsed
    createdAt
    updatedAt
  }
}
`

