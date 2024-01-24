import executeMultipleStargazeGraphQlQueries from "@/lib/multiplequeries";
import { TOKEN_DATA } from "@/services/api/gqlWalletSercice";
import { Sg721Token } from "@/types";
import { useQuery } from "@tanstack/react-query";



const useGetAllSg721Images = (props: Sg721Token[], keys: any[] = []) => {
  return useQuery({
    queryKey: ["sg721", ...keys],
    queryFn: async () => {
      return await executeMultipleStargazeGraphQlQueries<{
        token: { imageUrl: string };
      }>(
        props?.map((item) => {
          console.log({ item });
          return {
            query: TOKEN_DATA,
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
