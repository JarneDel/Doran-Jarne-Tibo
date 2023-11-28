import gql from 'graphql-tag'

export const ALL_SPORTS = gql`
  query {
    GetAllSports {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`

export const GET_SPORT = gql`
  query GetSportById($id: String!) {
    GetSportById(id: $id) {
      id
      name
      description
    }
  }
`

export const DELETE_SPORT = gql`
  mutation removeSportById($id: String!) {
    removeSportById(id: $id){
      id
    }
  }
`

export const CREATE_SPORT = gql`
mutation ($createSportInput: CreateSportInput!) {
  createSport(
    createSportInput: $createSportInput
  ) {
    id
    name
    description
  }
}
`

export interface ICreateSport {
  createSport: {
    id: string
    name: string
    description: string
  }
}

export interface createSportInput {
  name: string
  description: string
}