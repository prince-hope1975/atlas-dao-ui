import React from 'react'
import { Img } from 'react-image'
import styled from '@emotion/styled'

import ImagePlaceholder from '@/assets/images/ImagePlaceholder'
import { NFT } from '@/services/api/walletNFTsService'
import { Sg721Token } from '@/types'
import { gql, useQuery } from '@apollo/client'
import { getImageUrl } from '@/lib/getImageUrl'

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
`

const Image = styled(Img)`
	width: 100%;
	height: 100%;
	overflow: hidden;
	z-index: ${props => props.theme.zIndices.listingCardImg};
	position: absolute;
`

const PreviewImage = styled(Image)`
	position: unset;
`

const PreviewImageContainer = styled.div`
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;

	background: ${props => props.theme.colors.dark400};
	width: 24px;
	height: 24px;
	border-radius: 6px;
`

interface NFTPreviewImagesProps {
	nfts: Sg721Token[]
	previewItemsLimit?: number
}

function NFTPreviewImages({
	nfts,
	previewItemsLimit = 4,
}: NFTPreviewImagesProps) {
	  const { data, loading } = useQuery<{
      token: {
        imageUrl: string;
      };
    }>(
      gql`
        query Collection($collectionAddr: String!, $tokenId: String!) {
          token(collectionAddr: $collectionAddr, tokenId: $tokenId) {
            imageUrl
          }
        }
      `,
      {
        variables: {
          collectionAddr: nfts?.[0]?.address,
          tokenId: nfts?.[0]?.token_id,
        },
      }
    );
	return (
    <PreviewNFTsSection>
      {(nfts || []).slice(0, previewItemsLimit).map((nft) => (
        <PreviewImageContainer key={`${nft.address}_${nft.token_id}`}>
          {loading ? (
            <ImagePlaceholder width="61.56px" height="57.87px" />
          ) : (
            <PreviewImage src={getImageUrl(data?.token?.imageUrl!) ?? []} />
          )}
        </PreviewImageContainer>
      ))}

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
}

export default NFTPreviewImages
