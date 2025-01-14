import { VerifiedIcon } from "@/assets/icons/16pt";
import { HeartFilledIcon, HeartIcon, StarIcon } from "@/assets/icons/mixed";
import ImagePlaceholder from "@/assets/images/ImagePlaceholder";
import { Link } from "@/components/link";
import { Badge } from "@/components/ui";
import { clamp } from "lodash";
// import { useTranslation } from 'next-i18next'
import React from "react";
import { LOAN_STATE } from "@/services/api/loansService";
import { NFT } from "@/services/api/walletNFTsService";
import { Box, Flex } from "theme-ui";
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
  LikeIconContainer,
  LineSection,
  PreviewImage,
  PreviewImageContainer,
  PreviewNFTsSection,
  ProgressBar,
  RightTopImageArea,
  Subtitle,
  Title,
} from "./ListingCard.styled";
import LoanStateBadge from "./LoanStateBadge";
import { getImageUrl } from "@/lib/getImageUrl";
import { Sg721Token } from "@/types";
import { isVideo } from "@/lib/mediaCheck";

interface ListingCardProps extends NFT {
  liked?: boolean;
  verified?: boolean;
  name?: string;
  nfts: Sg721Token[];
  href: string;
  onLike: (nft: NFT) => void;
  disabled?: boolean;
  lookingForItemsLimit?: number;
  previewItemsLimit?: number;
  borrowAmount: number;
  apr: number | string;
  timeFrame: number;
  isSmall?: boolean;
  state: LOAN_STATE;
  defaultThreshold?: number;
  defaultPercentage?: number;
}

function ListingCard({
  liked,
  verified,
  nfts,
  href,
  onLike,
  disabled,
  previewItemsLimit = 4,
  isSmall,
  timeFrame,
  apr,
  borrowAmount,
  state,
  defaultPercentage,
  defaultThreshold,
  ...NFTProps
}: ListingCardProps) {
  const { name, collectionName, imageUrl } = NFTProps;
  // const { t } = useTranslation(['common', 'loans-listings'])

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Link passHref href={href} disabled={disabled}>
        {/* <a> */}
        <CardContainer>
          <ImageSection>
            {!imageUrl ? (
              <ImagePlaceholder width="61.56px" height="57.87px" />
            ) : isVideo(imageUrl) ? (
              <video controls src={getImageUrl(imageUrl)}></video>
            ) : (
              <Image style={{ zIndex: 0 }} src={getImageUrl(imageUrl) ?? []} />
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
                      key={`${nft.address}_${nft.token_id}`}
                    >
                      {!nft ? (
                        <ImagePlaceholder width="18px" height="18px" />
                      ) : isVideo(imageUrl) ? (
                        <video src={getImageUrl(imageUrl)}></video>
                      ) : (
                        <PreviewImage src={getImageUrl(imageUrl) || []} />
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
            <ProgressBar
              progress={
                [
                  LOAN_STATE.Inactive,
                  LOAN_STATE.Defaulted,
                  LOAN_STATE.Ended,
                ].includes(state)
                  ? 0
                  : clamp(defaultPercentage ?? 0, 0, 100)
              }
              threshold={clamp(defaultThreshold ?? 0, 0, 100)}
            />
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
                {Boolean(nfts.length > 1) && (
                  <Flex sx={{ ml: "4px", maxHeight: "18px" }}>
                    <OverflowTip>
                      <Badge bg="primary200">
                        {/* {t('common:more-nfts', { count: nfts.length })} */}
                        {nfts.length}
                      </Badge>
                    </OverflowTip>
                  </Flex>
                )}

                <LoanStateBadge loanState={state} />
              </Flex>
            </Flex>
          </DescriptionSection>
          <Flex sx={{ flexDirection: "column", gap: "6px", height: "64px" }}>
            <AttributeCard>
              <Flex sx={{ width: "100%", justifyContent: "space-between" }}>
                <Flex sx={{ flexDirection: "column" }}>
                  <AttributeName isSmall={isSmall}>
                    {/* {t('loan-listings:borrow')} */}
                    Borrow
                  </AttributeName>

                  <AttributeValue isSmall={isSmall}>
                    <OverflowTip>
                      <div>{borrowAmount}</div>
                    </OverflowTip>

                    <Box sx={{ ml: 8 }}>
                      <StarIcon />
                    </Box>
                  </AttributeValue>
                </Flex>
                <Flex sx={{ flexDirection: "column" }}>
                  <AttributeName isSmall={isSmall}>
                    {/* {t('loan-listings:earn')} */}
                    Earn
                  </AttributeName>

                  <AttributeValue isSmall={isSmall}>
                    <OverflowTip>
                      <div>
                        {/* {t('loan-listings:apr', { apr })} */}
                        {apr} %
                      </div>
                    </OverflowTip>
                  </AttributeValue>
                </Flex>
                <Flex sx={{ flexDirection: "column" }}>
                  <AttributeName isSmall={isSmall}>
                    {/* {t('loan-listings:time-frame')} */}
                    Timeframe
                  </AttributeName>

                  <AttributeValue isSmall={isSmall}>
                    <OverflowTip>
                      <div>
                        {/* {t('loan-listings:days', { count: timeFrame })} */}
                        {timeFrame} days
                      </div>
                    </OverflowTip>
                  </AttributeValue>
                </Flex>
              </Flex>
            </AttributeCard>
          </Flex>
        </CardContainer>
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
  isSmall: false,
  defaultPercentage: 0,
  defaultThreshold: 0,
};

export default ListingCard;
