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
