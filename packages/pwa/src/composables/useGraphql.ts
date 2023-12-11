import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  split,
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import useFirebase from './useFirebase'
import { logErrorMessages } from '@vue/apollo-util'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

const { firebaseUser } = useFirebase()

if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL is not set')
}

const httpLink = createHttpLink({
  // uri: 'http://localhost:3000/graphql',
  uri: import.meta.env.VITE_API_URL + '/graphql',
  credentials: 'same-origin',
})

const authLink = setContext(async (_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${await firebaseUser.value?.getIdToken()}`,
  },
}))

const errorLink = onError(error => {
  if (import.meta.env.DEV) logErrorMessages(error, false)
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_API_URL.replace('http', 'ws') + '/graphql',
    connectionParams: async () => {
      return {
        authorization: `Bearer ${await firebaseUser.value?.getIdToken()}`,
      }
    },
  }),
)

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  from([authLink, errorLink, httpLink]),
)

const read = (existing: any) => {
  return new Date(existing)
}

const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    typePolicies: {
      VacationRequest: {
        fields: {
          createdAt: { read },
          endDate: { read },
          startDate: { read },
          updatedAt: { read },
        },
      },
      vacationRequestsBy: {
        fields: {
          createdAt: { read },
          endDate: { read },
          startDate: { read },
          updatedAt: { read },
        },
      },
      Staff: {
        fields: {
          createdAt: { read },
          updatedAt: { read },
          holidayDates: {
            read(existing) {
              return existing.map((d: any) => new Date(d))
            },
          },
        },
      },
    },
  }),
})

export default () => {
  return { apolloClient }
}
