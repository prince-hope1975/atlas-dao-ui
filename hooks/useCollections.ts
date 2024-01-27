import executeMultipleStargazeGraphQlQueries from "@/lib/multiplequeries";
import {
  COLLECTION_DATA,
  Collection
} from "@/services/api/gqlWalletSercice";
import { Sg721Token } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useCollections = (props: Sg721Token[], keys: any[] = []) => {
  return useQuery({
    queryKey: [
      "collectionInfo",
      ...(props?.map((res) => res?.address) ?? []),
      ...keys,
    ],
    queryFn: async () => {
      return await executeMultipleStargazeGraphQlQueries<{
        collection: Collection;
      }>(
        props?.map((item) => {
          return {
            query: COLLECTION_DATA,
            variables: {
              collectionAddr: item.address,
            },
          };
        })
      );
    },
  });
};
