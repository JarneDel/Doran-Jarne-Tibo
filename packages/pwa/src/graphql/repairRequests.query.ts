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