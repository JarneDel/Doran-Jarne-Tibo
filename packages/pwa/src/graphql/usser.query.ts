import gql from 'graphql-tag'

export const USER_BY_UID = gql`
  query {
    userByUid {
      __typename
      ... on Group {
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
      ... on Staff {
        id
        UID
        locale
        role
        createdAt
        updatedAt
        firstName
        lastName
        email
        phone
        holidaysLeft
        holidayDates
      }
    }
  }
`
