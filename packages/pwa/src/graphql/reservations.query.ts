import gql from 'graphql-tag'

export const AVAILABLEMATERAILS = gql`
  query GetAvailableloanableMaterials(
    $date: String!
    $startTime: String!
    $endTime: String!
    $sportId: [String!]!
  ) {
    GetAvailableloanableMaterials(
      date: $date
      startTime: $startTime
      endTime: $endTime
      sportId: $sportId
    ) {
      id
      name
      totalAmount
      wantedAmount
      price
      sports {
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

export const GET_AVAILABLE_ROOMS = gql`
  query getAvailableRooms(
    $date: String!
    $startTime: String!
    $endTime: String!
  ) {
    getAvailableRooms(date: $date, startTime: $startTime, endTime: $endTime) {
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
    }
  }
`

export const CREATERESEVATION = gql`
  mutation createReservation(
    $date: DateTime!
    $startTime: String!
    $endTime: String!
    $groupId: String!
    $price: Float!
    $rooms: [RoomsInput!]!
    $material: [MaterialsInput!]!
  ) {
    createReservation(
      createReservationInput: {
        date: $date
        startTime: $startTime
        endTime: $endTime
        groupId: $groupId
        price: $price
        rooms: $rooms
        reservedMaterials: $material
      }
    ) {
      id
      date
      startTime
      endTime
      group {
        id
        UID
        locale
        role
        createdAt
        updatedAt
        name
        btwNumber
        score
      }
      reservedMaterials {
        name
        totalAmount
        wantedAmount
        price
        sports {
          id
          name
          createdAt
          updatedAt
        }
        isComplete
        description
      }
      rooms {
        name
        sports {
          id
          name
          createdAt
          updatedAt
        }
        pricePerHour
        type
      }
      price
      isCancelled
    }
  }
`
