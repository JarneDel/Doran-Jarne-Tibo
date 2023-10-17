import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import useFirebase from './useFirebase'

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

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
export default () => {
  return { apolloClient }
}
