import { ApolloClient, InMemoryCache } from '@apollo/client'
import {STARGAZE_GQL_INDEXER_URI} from '../../../constants/core'

export const stargazeIndexerClient = new ApolloClient({
  uri: STARGAZE_GQL_INDEXER_URI,
  cache: new InMemoryCache(),
})