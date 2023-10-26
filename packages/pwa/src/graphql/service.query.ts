import gql from 'graphql-tag'

export const ALL_SERVICES = gql`
  query {
    services {
      id
      name
      description
    }
  }
`

export const ALL_SERVICES_EXTENDED = gql`
  query {
    services {
      id
      name
      description
      rooms {
        id
        name
      }
      staff {
        id
        firstName
        lastName
        email
      }
      createdAt
      updatedAt
    }
  }
`

export interface Room {
  id: string
  name: string
}

export interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface Service {
  id: string
  name: string
  description: string
  rooms: Room[]
  staff: Staff[]
  createdAt: string
  updatedAt: string
}
export interface AllServicesExtendedData {
  services: Service[]
}

export interface IServiceItem {
  id: string
  name: string
  description: string
}

export interface IServices {
  services: IServiceItem[]
}
