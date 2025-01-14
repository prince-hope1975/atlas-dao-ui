import React from "react";
import styled from "@emotion/styled";
import Img from "next/image";
import ImagePlaceholder from "@/assets/images/ImagePlaceholder";
import { NFT } from "@/services/api/walletNFTsService";
import { Sg721Token } from "@/types";
import { gql, useQuery } from "@apollo/client";
import { getImageUrl } from "@/lib/getImageUrl";
import { TokenResponse, useToken } from "@/hooks/useTokens";
import { isVideo } from "@/lib/mediaCheck";

const PreviewNFTsSection = styled.div`
  display: flex;
  height: 24px;
  align-items: center;
  padding-left: 4px;
  padding-right: 4px;
  overflow: hidden;
  gap: 2px;

  font-style: normal;
  font-weight: 700;
  font-size: 12px;
`;

const Image = styled(Img)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: ${(props) => props.theme.zIndices.listingCardImg};
  position: absolute;
`;

const PreviewImage = styled(Image)`
  position: unset;
`;

const PreviewImageContainer = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${(props) => props.theme.colors.dark400};
  width: 24px;
  height: 24px;
  border-radius: 6px;
`;

interface NFTPreviewImagesProps {
  nfts: TokenResponse[];
  loading: boolean;
  previewItemsLimit?: number;
}

function NFTPreviewImages({
  nfts,
  previewItemsLimit = 4,
  loading = false,
}: NFTPreviewImagesProps) {
  // const { data, loading } = useQuery<{
  //   token: {
  //     imageUrl: string;
  //   };
  // }>(
  //   gql`
  //     query Collection($collectionAddr: String!, $tokenId: String!) {
  //       token(collectionAddr: $collectionAddr, tokenId: $tokenId) {
  //         imageUrl
  //       }
  //     }
  //   `,
  //   {
  //     variables: {
  //       collectionAddr: nfts?.[0]?.address,
  //       tokenId: nfts?.[0]?.token_id,
  //     },
  //   }
  // );
  return (
    <PreviewNFTsSection>
      {((nfts?.map((res) => res?.token) ?? nfts) || [])
        .slice(0, previewItemsLimit)
        .map((nft, id) => {
          return (
            <PreviewImageContainer key={`${id}`}>
              {loading || !nft ? (
                <ImagePlaceholder width="61.56px" height="57.87px" />
              ) : isVideo(nfts?.at(id)?.token?.imageUrl ?? "") ? (
                <video
                  src={getImageUrl(nfts?.at(id)?.token?.imageUrl ?? "")}
                ></video>
              ) : (
                <PreviewImage
                  width={100}
                  height={100}
                  alt={nfts?.at(id)?.token?.description ?? "alt"}
                  src={getImageUrl(nfts?.at(id)?.token?.imageUrl!) ?? []}
                />
              )}
            </PreviewImageContainer>
          );
        })}

      {(nfts || []).slice(previewItemsLimit).length ? (
        <PreviewImageContainer>
          +{(nfts || []).slice(previewItemsLimit).length}
        </PreviewImageContainer>
      ) : (
        ""
      )}
    </PreviewNFTsSection>
  );
}

NFTPreviewImages.defaultProps = {
  previewItemsLimit: 4,
};

export default NFTPreviewImages;
