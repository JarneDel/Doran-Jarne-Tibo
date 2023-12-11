import gql from 'graphql-tag';

export const ALL_REPAIR_REQUESTS = gql`
query {
    GetAllRepairRequests {
      id
      title
      requestUser{
        ...on Group{
          id
          UID
          email
          locale
          role
          createdAt
          updatedAt
          name
          btwNumber
          score
        }
        ...on Staff{
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
      description
      urgency
      room{
        id
        name
        sports{
          id
          name
        }
        pricePerHour
        type
      }
      loanableMaterial{
        id
        name
        totalAmount
        wantedAmount
        price
        sports{
          id
          name
        }
        isComplete
        description
      }
      isRepaired
      createdAt
      updatedAt
    }
  }
` 

export const GET_ONE_REPAIR_REQUEST = gql`
query GetRepairRequestById($repairRequestId: String!) {
  GetRepairRequestById(id: $repairRequestId) {
    id
    title
    urgency
    requestUser {
      ... on Group {
        id
        UID
        email
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
    description
    room{
      id
      name
      sports{
        id
        name
      }
      pricePerHour
      type
    }
    loanableMaterial{
      id
      name
      totalAmount
      wantedAmount
      price
      sports{
        id
        name
      }
      isComplete
      description
    }
    isRepaired
    createdAt
    updatedAt
  }
}
`

export const UPDATE_REPAIR_REQUEST = gql`
mutation($updateRepairRequestInput: UpdateRepairRequestInput!) {
  updateRepairRequest(updateRepairRequestInput: $updateRepairRequestInput) {
    id
  }
}
`

export const DELETE_REPAIR_REQUEST = gql`
mutation RemoveRepairRequestById($repairRequestId: String!) {
  removeRepairRequest(id: $repairRequestId)
}
`

export const CREATE_REPAIR_REQUEST = gql`
  mutation createRepairRequestInput(
    $requestUserId: String!
    $room: [RoomsInput!]
    $loanableMaterial: [MaterialsInput!]
    $title: String!
    $description: String!
  ) {
    createRepairRequest(
      createRepairRequestInput: {
        requestUserId: $requestUserId
        title: $title
        description: $description
        room: $room
        loanableMaterial: $loanableMaterial
      }
    ) {
      id
      requestUser {
        __typename
      }
      title
      description
      room {
        id
        name
        sports {
          id
          name
        }
        pricePerHour
        type
      }
      loanableMaterial {
        id
        name
        totalAmount
        wantedAmount
        sports {
          id
          name
        }
        price
        isComplete
        description
        amountReserved
      }
      urgency
      isRepaired
    }
  }
`