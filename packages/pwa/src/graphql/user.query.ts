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
        profilePictureUrl
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
        profilePictureUrl
      }
    }
  }
`

export const UPDATE_GROUP = gql`
  mutation updateGroup(
    $_id: String!
    $name: String!
    $locale: String!
    $btwNumber: String
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
export const UPDATE_STAFF = gql`
  mutation updateStaffInput(
    $id: String!
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $locale: String!
  ) {
    updateStaff(
      updateStaffInput: {
        id: $id
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        locale: $locale
      }
    ) {
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
`

export const CREATE_GROUP = gql`
  mutation createGroup($createGroupInput: CreateGroupInput!) {
    createGroup(createGroupInput: $createGroupInput) {
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

export interface CreateGroupInput {
  createGroupInput: {
    btwNumber: string
    locale: string
    name: string
    profilePictureUrl?: string
    email: string
  }
}
