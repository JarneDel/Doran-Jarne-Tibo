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

export const UPDATE_GROUP = gql`
  mutation updateGroup(
    $_id: String!
    $name: String!
    $locale: String!
    $btwNumber: String!
  ) {
    updateGroup(
      updateGroupInput: {
        _id: $_id
        name: $name
        locale: $locale
        btwNumber: $btwNumber
      }
    ) {
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
  }
`
