import { VerifiedIcon } from "@/assets/icons/16pt";
import {
  AvatarIcon,
  HeartFilledIcon,
  HeartIcon,
  StarIcon,
} from "@/assets/icons/mixed";
import ImagePlaceholder from "@/assets/images/ImagePlaceholder";
import { Link } from "@/components/link";
import { Badge } from "@/components/ui";
import useNameService from "@/hooks/useNameService";
import moment from "moment";
// import { useTranslation } from 'next-i18next'
import React from "react";
import { RAFFLE_STATE } from "@/services/api/rafflesService";
import { Box, Flex } from "theme-ui";
import { fromIPFSImageURLtoImageURL } from "@/utils/blockchain/ipfs";
import getShortText from "@/utils/js/getShortText";
import { OverflowTip } from "../../../ui/overflow-tip";

import {
  AttributeCard,
  AttributeName,
  AttributeValue,
  BottomImageArea,
  CardContainer,
  DescriptionSection,
  Image,
  ImageSection,
  LeftCutout,
  LikeIconContainer,
  Line,
  LineSection,
  NameLabel,
  NameServiceImage,
  NameServiceImagePlaceholder,
  PreviewImage,
  PreviewImageContainer,
  PreviewNFTsSection,
  RaffleWinner,
  RaffleWinnerAddress,
  RaffleWinnerBadge,
  RaffleWinnerSection,
  RightCutout,
  RightTopImageArea,
  Subtitle,
  Title,
} from "./ListingCard.styled";
import RaffleStateBadge from "./RaffleStateBadge";
import {
  AssetInfo,
  RaffleState,
  Sg721Token,
} from "@/services/blockchain/contracts/raffles/Raffle.types";
import { NFT } from "@/services/api/walletNFTsService";
import { gql, useQuery } from "@apollo/client";
import { getImageUrl } from "@/lib/getImageUrl";
import { DEFAULT_CURRENCY } from "@/constants/core";
import { TokenResponse } from "@/hooks/useTokens";

interface StargazeListingCardProps extends NFT {
  liked?: boolean;
  verified?: boolean;
  name?: string;
  nfts: TokenResponse[];
  href: string;
  onLike: (nft: AssetInfo) => void;
  disabled?: boolean;
  lookingForItemsLimit?: number;
  previewItemsLimit?: number;
  winner?: string;
  ticketPrice: number;
  ticketCurrency: string;
  ticketNumber: number;
  totalVolume: number;
  ticketsRemaining: number;
  endsIn: Date;
  isSmall?: boolean;
  state: RAFFLE_STATE;
}
interface ListingCardProps extends NFT {
  liked?: boolean;
  verified?: boolean;
  name?: string;
  nfts: NFT[];
  href: string;
  onLike: (nft: NFT) => void;
  disabled?: boolean;
  lookingForItemsLimit?: number;
  previewItemsLimit?: number;
  winner?: string;
  ticketPrice: number;
  ticketCurrency: string;
  ticketNumber: number;
  totalVolume: number;
  ticketsRemaining: number;
  endsIn: Date;
  isSmall?: boolean;
  state: RAFFLE_STATE;
}

export function StargazeListingCard({
  winner,
  liked,
  verified,
  nfts,
  href,
  onLike,
  disabled,
  previewItemsLimit = 4,
  ticketPrice,
  ticketCurrency,
  ticketNumber,
  totalVolume,
  ticketsRemaining,
  endsIn,
  isSmall,
  state,
  ...NFTProps
}: StargazeListingCardProps) {
  const { name, collectionName, id: imageUrl } = NFTProps;

  // 	const { t } = useTranslation(['common', 'raffle-listings'])

  const [nameServiceResolution] = useNameService(winner ? [winner] : []);
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
        collectionAddr: nfts?.[0]?.token?.collectionAddr,
        tokenId: nfts?.[0]?.token?.tokenId,
      },
    }
  );

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Link passHref href={href} disabled={disabled}>
        {/* <a> */}
        <CardContainer hasNoBottomRadius={!!winner}>
          <ImageSection>
            {loading ? (
              <ImagePlaceholder width="61.56px" height="57.87px" />
            ) : (
              <Image
                style={{ zIndex: 0 }}
                src={getImageUrl(data?.token?.imageUrl!) ?? []}
              />
            )}
            <RightTopImageArea
              style={{ zIndex: 0 }}
              onClick={(e) => {
                // disable link when clicking on like icon
                e.preventDefault();
                onLike(NFTProps);
              }}
            >
              <LikeIconContainer>
                {liked ? (
                  <HeartFilledIcon width="18px" height="15.24px" />
                ) : (
                  <HeartIcon width="18px" height="15.24px" />
                )}
              </LikeIconContainer>
            </RightTopImageArea>
            {(nfts || []).length ? (
              <BottomImageArea>
                <PreviewNFTsSection>
                  {(nfts || []).slice(0, previewItemsLimit).map((nft) => (
                    <PreviewImageContainer
                      key={`${nft?.token?.collectionAddr}_${nft.token?.tokenId}`}
                    >
                      {!(nft?.token?.imageUrl )? (
                        <ImagePlaceholder width="18px" height="18px" />
                      ) : (
                        <PreviewImage src={getImageUrl(nft?.token?.imageUrl )?? []} />
                      )}
                    </PreviewImageContainer>
                  ))}
                  {(nfts || []).slice(previewItemsLimit).length
                    ? `+${(nfts || []).slice(previewItemsLimit).length}`
                    : ""}
                </PreviewNFTsSection>
              </BottomImageArea>
            ) : null}
          </ImageSection>
          <LineSection>
            <Line />
            <LeftCutout />
            <RightCutout />
          </LineSection>
          <DescriptionSection>
            <Flex>
              <Flex sx={{ flex: 1 }}>
                <OverflowTip>
                  <Title>{name}</Title>
                </OverflowTip>
              </Flex>
            </Flex>
            <Flex sx={{ alignItems: "center" }}>
              <OverflowTip>
                <Subtitle>{collectionName}</Subtitle>
              </OverflowTip>

              {verified && (
                <Box ml={["4px"]} mt="6px">
                  <VerifiedIcon width="17.27px" height="17.27px" />
                </Box>
              )}
              <Flex sx={{ ml: "auto" }}>
                {Boolean(nfts?.length > 1) && (
                  <Flex sx={{ ml: "4px", maxHeight: "18px" }}>
                    <OverflowTip>
                      <Badge bg="primary200">
                        {/* {t('common:more-nfts', { count: nfts?.length })} */}
                        {nfts?.length} NFTs
                      </Badge>
                    </OverflowTip>
                  </Flex>
                )}
                <RaffleStateBadge raffleState={state} />
              </Flex>
            </Flex>
          </DescriptionSection>
          {!winner && (
            <Flex sx={{ flexDirection: "column", gap: "6px", height: "130px" }}>
              <AttributeCard>
                <Flex sx={{ width: "100%", justifyContent: "space-between" }}>
                  <Flex sx={{ flexDirection: "column" }}>
                    <AttributeName isSmall={isSmall}>
                      {/* {t('raffle-listings:price-ticket')} */}
                      Price/Ticket
                    </AttributeName>

                    <AttributeValue isSmall={isSmall}>
                      <OverflowTip>
                        <div>{`${ticketPrice} ${ticketCurrency}`} </div>
                      </OverflowTip>

                      <Box sx={{ ml: 8 }}>
                        <StarIcon />
                      </Box>
                    </AttributeValue>
                  </Flex>
                  <Flex sx={{ flexDirection: "column" }}>
                    <AttributeName
                      style={{ alignSelf: "flex-end" }}
                      isSmall={isSmall}
                    >
                      {/* {t('raffle-listings:remaining')} */}
                      Remaining
                    </AttributeName>

                    <AttributeValue isSmall={isSmall}>
                      <OverflowTip>
                        <div>{`${ticketsRemaining} / ${ticketNumber}`}</div>
                      </OverflowTip>
                    </AttributeValue>
                  </Flex>
                </Flex>
              </AttributeCard>
              <AttributeCard>
                <Flex sx={{ width: "100%", justifyContent: "space-between" }}>
                  <Flex sx={{ flexDirection: "column" }}>
                    <AttributeName isSmall={isSmall}>
                      {/* {t(
													`raffle-listings:${moment().isAfter(endsIn) ? 'ended' : 'ends-in'}`
												)} */}
                      {moment().isAfter(endsIn) ? "ended" : "ends-in"}
                    </AttributeName>
                    <AttributeValue isSmall={isSmall}>
                      {moment(endsIn).fromNow()}
                    </AttributeValue>
                  </Flex>
                  <Flex sx={{ flexDirection: "column" }}>
                    <AttributeName
                      style={{ alignSelf: "flex-end" }}
                      isSmall={isSmall}
                    >
                      {/* {t(`raffle-listings:total-volume`)} */}
                      Total Volume
                    </AttributeName>
                    <AttributeValue isSmall={isSmall}>
                      {`${totalVolume.toFixed(2)} ${DEFAULT_CURRENCY}`}
                    </AttributeValue>
                  </Flex>
                </Flex>
              </AttributeCard>
            </Flex>
          )}
        </CardContainer>
        {winner && (
          <RaffleWinnerSection>
            <RaffleWinnerBadge>
              <Box>🎊</Box>
              <Box>🥳</Box>
              <RaffleWinner>
                {/* {t('raffle-listings:raffle-winner')} */}
                Raffler Winner!
              </RaffleWinner>
              <Box>🥳</Box>
              <Box>🎊</Box>
            </RaffleWinnerBadge>
            <Flex sx={{ gap: "10px", alignItems: "center" }}>
              <NameServiceImagePlaceholder>
                {nameServiceResolution?.extension?.image ? (
                  <NameServiceImage
                    src={fromIPFSImageURLtoImageURL(
                      nameServiceResolution?.extension?.image
                    )}
                  />
                ) : (
                  <AvatarIcon width="100%" height="100%" />
                )}
              </NameServiceImagePlaceholder>
              <Flex sx={{ flexDirection: "column", justifyContent: "center" }}>
                <NameLabel>
                  {nameServiceResolution?.extension?.name ?? ""}
                </NameLabel>
                <RaffleWinnerAddress>
                  {getShortText(winner, 10)}
                </RaffleWinnerAddress>
              </Flex>
            </Flex>
          </RaffleWinnerSection>
        )}
        {/* </a> */}
      </Link>
    </Box>
  );
}
function ListingCard({
  winner,
  liked,
  verified,
  nfts,
  href,
  onLike,
  disabled,
  previewItemsLimit = 4,
  ticketPrice,
  ticketCurrency,
  ticketNumber,
  totalVolume,
  ticketsRemaining,
  endsIn,
  isSmall,
  state,
  ...NFTProps
}: ListingCardProps) {
  const { name, collectionName, id: imageUrl } = NFTProps;
  // 	const { t } = useTranslation(['common', 'raffle-listings'])
  const [nameServiceResolution] = useNameService(winner ? [winner] : []);

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Link passHref href={href} disabled={disabled}>
        {/* <a> */}
        <CardContainer hasNoBottomRadius={!!winner}>
          <ImageSection>
            {imageUrl?.every((img) => img === "") ? (
              <ImagePlaceholder width="61.56px" height="57.87px" />
            ) : (
              <Image src={imageUrl ?? []} />
            )}
            <RightTopImageArea
              onClick={(e) => {
                // disable link when clicking on like icon
                e.preventDefault();
                onLike(NFTProps);
              }}
            >
              <LikeIconContainer>
                {liked ? (
                  <HeartFilledIcon width="18px" height="15.24px" />
                ) : (
                  <HeartIcon width="18px" height="15.24px" />
                )}
              </LikeIconContainer>
            </RightTopImageArea>
            {(nfts || []).length ? (
              <BottomImageArea>
                <PreviewNFTsSection>
                  {(nfts || []).slice(0, previewItemsLimit).map((nft) => (
                    <PreviewImageContainer
                      key={`${nft.collectionAddress}_${nft.tokenId}`}
                    >
                      {nft?.id?.every((img) => img === "") ? (
                        <ImagePlaceholder width="18px" height="18px" />
                      ) : (
                        <PreviewImage src={nft?.id ?? []} />
                      )}
                    </PreviewImageContainer>
                  ))}
                  {(nfts || []).slice(previewItemsLimit).length
                    ? `+${(nfts || []).slice(previewItemsLimit).length}`
                    : ""}
                </PreviewNFTsSection>
              </BottomImageArea>
            ) : null}
          </ImageSection>
          <LineSection>
            <Line />
            <LeftCutout />
            <RightCutout />
          </LineSection>
          <DescriptionSection>
            <Flex>
              <Flex sx={{ flex: 1 }}>
                <OverflowTip>
                  <Title>{name}</Title>
                </OverflowTip>
              </Flex>
            </Flex>
            <Flex sx={{ alignItems: "center" }}>
              <OverflowTip>
                <Subtitle>{collectionName}</Subtitle>
              </OverflowTip>

              {verified && (
                <Box ml={["4px"]} mt="6px">
                  <VerifiedIcon width="17.27px" height="17.27px" />
                </Box>
              )}
              <Flex sx={{ ml: "auto" }}>
                {Boolean(nfts?.length > 1) && (
                  <Flex sx={{ ml: "4px", maxHeight: "18px" }}>
                    <OverflowTip>
                      <Badge bg="primary200">
                        {/* {t('common:more-nfts', { count: nfts?.length })} */}
                        {nfts?.length} NFTs
                      </Badge>
                    </OverflowTip>
                  </Flex>
                )}
                <RaffleStateBadge raffleState={state} />
              </Flex>
            </Flex>
          </DescriptionSection>
          {!winner && (
            <Flex sx={{ flexDirection: "column", gap: "6px", height: "130px" }}>
              <AttributeCard>
                <Flex sx={{ width: "100%", justifyContent: "space-between" }}>
                  <Flex sx={{ flexDirection: "column" }}>
                    <AttributeName isSmall={isSmall}>
                      {/* {t('raffle-listings:price-ticket')} */}
                      Price/Ticket
                    </AttributeName>

                    <AttributeValue isSmall={isSmall}>
                      <OverflowTip>
                        <div>{`${ticketPrice} ${ticketCurrency}`} </div>
                      </OverflowTip>

                      <Box sx={{ ml: 8 }}>
                        <StarIcon />
                      </Box>
                    </AttributeValue>
                  </Flex>
                  <Flex sx={{ flexDirection: "column" }}>
                    <AttributeName
                      style={{ alignSelf: "flex-end" }}
                      isSmall={isSmall}
                    >
                      {/* {t('raffle-listings:remaining')} */}
                      Remaining
                    </AttributeName>

                    <AttributeValue isSmall={isSmall}>
                      <OverflowTip>
                        <div>{`${ticketsRemaining} / ${ticketNumber}`}</div>
                      </OverflowTip>
                    </AttributeValue>
                  </Flex>
                </Flex>
              </AttributeCard>
              <AttributeCard>
                <Flex sx={{ width: "100%", justifyContent: "space-between" }}>
                  <Flex sx={{ flexDirection: "column" }}>
                    <AttributeName isSmall={isSmall}>
                      {/* {t(
													`raffle-listings:${moment().isAfter(endsIn) ? 'ended' : 'ends-in'}`
												)} */}
                      {moment().isAfter(endsIn) ? "ended" : "ends-in"}
                    </AttributeName>
                    <AttributeValue isSmall={isSmall}>
                      {moment(endsIn).fromNow()}
                    </AttributeValue>
                  </Flex>
                  <Flex sx={{ flexDirection: "column" }}>
                    <AttributeName
                      style={{ alignSelf: "flex-end" }}
                      isSmall={isSmall}
                    >
                      {/* {t(`raffle-listings:total-volume`)} */}
                      Total Volume
                    </AttributeName>
                    <AttributeValue isSmall={isSmall}>
                      {`${totalVolume.toFixed(2)} ${ticketCurrency}`}
                    </AttributeValue>
                  </Flex>
                </Flex>
              </AttributeCard>
            </Flex>
          )}
        </CardContainer>
        {winner && (
          <RaffleWinnerSection>
            <RaffleWinnerBadge>
              <Box>🎊</Box>
              <Box>🥳</Box>
              <RaffleWinner>
                {/* {t('raffle-listings:raffle-winner')} */}
                Raffler Winner!
              </RaffleWinner>
              <Box>🥳</Box>
              <Box>🎊</Box>
            </RaffleWinnerBadge>
            <Flex sx={{ gap: "10px", alignItems: "center" }}>
              <NameServiceImagePlaceholder>
                {nameServiceResolution?.extension?.image ? (
                  <NameServiceImage
                    src={fromIPFSImageURLtoImageURL(
                      nameServiceResolution?.extension?.image
                    )}
                  />
                ) : (
                  <AvatarIcon width="100%" height="100%" />
                )}
              </NameServiceImagePlaceholder>
              <Flex sx={{ flexDirection: "column", justifyContent: "center" }}>
                <NameLabel>
                  {nameServiceResolution?.extension?.name ?? ""}
                </NameLabel>
                <RaffleWinnerAddress>
                  {getShortText(winner, 10)}
                </RaffleWinnerAddress>
              </Flex>
            </Flex>
          </RaffleWinnerSection>
        )}
        {/* </a> */}
      </Link>
    </Box>
  );
}

ListingCard.defaultProps = {
  liked: false,
  verified: false,
  name: "",
  disabled: false,
  lookingForItemsLimit: 4,
  previewItemsLimit: 4,
  winner: "",
  isSmall: false,
};

export default ListingCard;
