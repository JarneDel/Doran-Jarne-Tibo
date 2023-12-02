import { gql, TypedDocumentNode } from '@apollo/client/core'

export const ALL_SERVICES: TypedDocumentNode<{ services: serviceItem[] }> = gql`
  query {
    services {
      id
      name
      description
    }
  }
`

