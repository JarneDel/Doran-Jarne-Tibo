import gql from 'graphql-tag';

export const ALL_GROUPS = gql`
  query {
    groups {
      _id
      name
    }
  }
  `