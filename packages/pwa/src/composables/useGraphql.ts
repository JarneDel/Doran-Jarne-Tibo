import { createHttpLink, ApolloClient,InMemoryCache  } from '@apollo/client/core';

const httpLink= createHttpLink({
    uri:'http://localhost:3000/graphql',
});

export default () => {
    const apolloClient = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
    });
    return {apolloClient}
}