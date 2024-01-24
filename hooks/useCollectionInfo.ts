import executeMultipleStargazeGraphQlQueries from "@/lib/multiplequeries";
import {
  COLLECTION_DATA,
  Collection
} from "@/services/api/gqlWalletSercice";
import { useQuery } from "@tanstack/react-query";

export const useCollectionInfo = (collectionAddr: string, keys: any[] = []) => {
  return useQuery({
    queryKey: ["collectionAddr", ...keys],
    queryFn: async () => {
      const collection = await executeMultipleStargazeGraphQlQueries<Collection>([
        {
          query: COLLECTION_DATA,
          variables: {
            collectionAddr: collectionAddr,
          },
        },
      ]);
      return collection?.at(0);
    },
  });
};
