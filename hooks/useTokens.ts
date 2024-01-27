import executeMultipleStargazeGraphQlQueries from "@/lib/multiplequeries";
import {
  ALL_TOKEN_DATA,
  COLLECTION_AND_TOKEN_DATA,
} from "@/services/api/gqlWalletSercice";
import { Sg721Token } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface Token {
  imageUrl: string;
  id: string;
  name: string;
  description: string;
  createdAt: string;
  ownerAddr: string;
  //   price: null;
}

export interface TokenResponse {
  token: Token;
}

export const useToken = (props: Sg721Token[], keys: any[] = []) => {
  return useQuery({
    queryKey: ["sg721", ...keys],
    queryFn: async () => {
      return await executeMultipleStargazeGraphQlQueries<TokenResponse>(
        props?.map((item) => {
          return {
            query: ALL_TOKEN_DATA,
            variables: {
              collectionAddr: item.address,
              tokenId: item.token_id,
            },
          };
        })
      );
    },
  });
};

