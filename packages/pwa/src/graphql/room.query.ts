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

export const ALL_GYMS = gql`
query{
  GetAllGyms{
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

export const ALL_CHANGING_ROOMS = gql`
query{
  GetAllChangingRooms{
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

export const ALL_WORK_ROOMS = gql`
query{
  GetAllWorkRooms{
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

export const ALL_SWIMMING_POOLS = gql`
query{
  GetAllSwimmingPools{
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

export const ALL_DIVE_POOLS = gql`
query{
  GetAllDivePools{
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

export const GET_ONE_ROOM = gql`
query GetRoomById($roomId: String!) {
  GetRoomById(id: $roomId) {
    id
    name
    sports {
      id
      name
    }
    pricePerHour
    type
    canBeUsed
  }
}
`

export const CREATE_ROOM = gql`
  mutation ($createRoomInput: CreateRoomInput!) {
    createRoom(createRoomInput:$createRoomInput)
     {
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

export const UPDATE_ROOM = gql`
mutation ($updateRoomInput: UpdateRoomInput!){
  updateRoom(updateRoomInput: $updateRoomInput){
    id
  }
}
`

export const DELETE_ROOM = gql`
mutation RemoveRoomById($roomId: String!) {
  removeRoomById(id: $roomId)
}
`

export interface ICreateRoom{
  createRoom: {
    id: string
    name: string
    sports: {
      id: string
      name: string
      createdAt: string
      updatedAt: string
    }[]
    pricePerHour: number
    type: string
  }
}

export interface createRoomInput{
  name: string
  SportId: string[]
  pricePerHour: number
  type: string
}