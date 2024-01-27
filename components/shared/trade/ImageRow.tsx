import React from "react";

import {
  RightTopImageArea,
  LikeIconContainer,
  ImageSection,
  Image,
} from "@/components/trade-listing-details";

import { HeartFilledIcon, HeartIcon } from "@/assets/icons/mixed";
import ImagePlaceholder from "@/assets/images/ImagePlaceholder";
import { NFT } from "@/services/api/walletNFTsService";
import { stargazeIndexerClient } from "@/services/graphql";
import { DocumentNode } from "graphql";
import { useQuery } from "@tanstack/react-query";
import executeMultipleStargazeGraphQlQueries from "@/lib/multiplequeries";
import { gql } from "@apollo/client";
import { ALL_TOKEN_DATA, TOKEN_DATA } from "@/services/api/gqlWalletSercice";
import { Sg721Token } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";

interface ImageRowProps extends Omit<Partial<NFT>,"id">  {
  liked?: boolean;
  nft?: Sg721Token[];
  id?:string|number;
  onLike: (nft?: NFT) => void;
}

const useGetAllSg721Images = (props: Sg721Token[], keys: any[] = []) => {
  return useQuery({
    queryKey: ["sg721", ...keys],
    queryFn: async () => {
      return await executeMultipleStargazeGraphQlQueries<{
        token: { imageUrl: string };
      }>(
        props?.map((item) => {
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
// const executeMultipleStargazeGraphQlQueries = async (
//   ...query: Array<{
//     query: DocumentNode;
//     variable: Record<string, number | string>;
//   }>
// ) => {
//   await Promise.all(
//     query.map(async (q) => {
//       const res = await stargazeIndexerClient?.query<{}>({
//         query: q.query,
//         variables: q.variable,
//       });
//       console.log("executed");
//       return res.data; // return true if all queries are executed successfully. Otherwise, return false.
//     })
//   );
//   const res1 = await stargazeIndexerClient?.query<{}>({
//     query: COLLECTION_DATA,
//     variables: {
//       collectionAddr: res,
//     },
//   });
// };

function ImageRow({ id: id, nft, onLike, liked }: ImageRowProps) {
  const { data, isLoading } = useGetAllSg721Images(nft!, [nft?.length ?? 0,id]);
  return (
    <ImageSection>
      {isLoading ? (
        <ImagePlaceholder width="61.56px" height="57.87px" />
      ) : (
        <Image
          src={
            data
              ?.filter((res) => res?.token?.imageUrl)
              .map((item) => getImageUrl(item!?.token?.imageUrl))! ?? []
          }
          alt="img"
        />
      )}
      {/* <RightTopImageArea
        onClick={(e) => {
          // disable link when clicking on like icon
          e.preventDefault();
		//   !uncomment later
        //   onLike(nft!);
        }}
      >
        <LikeIconContainer>
          {liked ? (
            <HeartFilledIcon width="18px" height="15.24px" />
          ) : (
            <HeartIcon width="18px" height="15.24px" />
          )}
        </LikeIconContainer>
      </RightTopImageArea> */}
    </ImageSection>
  );
}

ImageRow.defaultProps = {
  liked: false,
  nft: undefined,
};

export default ImageRow;
