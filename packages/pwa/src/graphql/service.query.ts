import gql from 'graphql-tag'

export const ALL_SERVICES = gql`
query {
  services{
    id
    name
    description
    staff{
      id
      UID
      locale
      role
      profilePictureUrl
      firstName
      lastName
      email
      phone
    }
    rooms{
      id
      name
      sports{
        id
        name
        description
      }
      pricePerHour
      type
      canBeUsed
    }
  }
}
`

export const GET_SERVICE = gql`
  query GetServiceById($id: String!) {
    service(id: $id) {
      id
      name
      description
      staff{
        id
        UID
        locale
        role
        profilePictureUrl
        firstName
        lastName
        email
        phone
      }
      rooms{
        id
        name
        sports{
          id
          name
          description
        }
        pricePerHour
        type
        canBeUsed
      }
    }
  }
`

export const DELETE_SERVICE = gql`
  mutation removeServiceById($id: String!) {
    removeServiceById(id: $id)
  }
`

export const CREATE_SERVICE = gql`
mutation ($createServiceInput: CreateServiceInput!) {
  createService(
    createServiceInput: $createServiceInput
  ) {
    id
    name
    description
    staff{
      id
      UID
      locale
      role
      profilePictureUrl
      firstName
      lastName
      email
      phone
    }
    rooms{
      id
      name
      sports{
        id
        name
        description
      }
      pricePerHour
      type
      canBeUsed
    }
  }
}
`

export const UPDATE_SERVICE = gql`
mutation ($updateServiceInput: UpdateServiceInput!) {
  updateService(
    updateServiceInput: $updateServiceInput
  ) {
    id
    name
    description
    staff{
      id
      UID
      locale
      role
      profilePictureUrl
      firstName
      lastName
      email
      phone
    }
    rooms{
      id
      name
      sports{
        id
        name
        description
      }
      pricePerHour
      type
      canBeUsed
    }
  }
}
`

export interface IServiceItem {
  id: string
  name: string
  description: string
  staff: [{
    id: string
    UID: string
    locale: string
    role: string
    profilePictureUrl: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }]
  rooms: [{
    id: string
    name: string
    sports: {
      id: string
      name: string
      description: string
    }
    pricePerHour: number
    type: string
    canBeUsed: boolean
  }]
}

export interface IServices {
  services: IServiceItem[]
}

export interface ICreateService {
  createService: {
    id: string
    name: string
    description: string
    roomId: string[]
    staffUID: string[]
  }
}

export interface createServiceInput {
  name: string
  description: string
  roomId: string[]
  staffUID: string[]
}