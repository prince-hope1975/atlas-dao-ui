import { stargazeIndexerClient } from "@/services/graphql";
import { QueryResult } from "@apollo/client";
import { DocumentNode } from "graphql";

const executeMultipleStargazeGraphQlQueries = async <T>(
  //   stargazeIndexerClient: ApolloClient<NormalizedCacheObject> | null,
  queries: Array<{
    query: DocumentNode;
    variables?: Record<string, number | string>;
  }>
) => {
  const results = await Promise.all(
    queries.map(async (q) => {
      try {
        const res = await stargazeIndexerClient?.query<T>({
          query: q.query,
          variables: q.variables,
        });
        console.log({res})
        return res!;
      } catch (error) {
        console.error("Error executing query:", error);
        return null;
      }
    })
  );

  return results?.map(res=>res?.data!);
};

export default executeMultipleStargazeGraphQlQueries;
