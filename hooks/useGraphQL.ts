
import { STARGAZE_GRAPHQL_ENDPOINT } from '@/constants/core';
import { GraphQLClient } from 'graphql-request';

export function useGraphQL() {
  return new GraphQLClient(STARGAZE_GRAPHQL_ENDPOINT);
}