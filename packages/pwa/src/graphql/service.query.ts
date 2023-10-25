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

export interface IServiceItem {
  id: string
  name: string
  description: string
}

export interface IServices {
  services: IServiceItem[]
}
