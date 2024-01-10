import { ApolloClient, InMemoryCache } from '@apollo/client'
import {STARGAZE_GRAPHQL_ENDPOINT} from '../../../constants/core'

export const stargazeIndexerClient = new ApolloClient({
  uri: STARGAZE_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})