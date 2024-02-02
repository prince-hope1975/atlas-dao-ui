import { VerifiedIcon } from "@/assets/icons/16pt";
import CheckedOutlineIcon from "@/assets/icons/32pt/CheckedOutlineIcon";
import ImagePlaceholder from "@/assets/images/ImagePlaceholder";
import { OverflowTip } from "@/components/ui";
import { noop } from "lodash";
// import { useTranslation } from 'next-i18next'
import React from "react";
import { Box, Flex } from "theme-ui";

import {
  CardContainer,
  CoverLabel,
  DescriptionSection,
  Image,
  ImageSection,
  RightImageArea,
  Subtitle,
  Title,
} from "./NFTCard.styled";
import { Token } from "@/services/api/gqlWalletSercice";
import { getImageUrl } from "@/lib/getImageUrl";
import { isVideo } from "@/lib/mediaCheck";

type SizeVariants = "small" | "medium";

interface NFTCardProps {
  checked?: boolean;
  verified?: boolean;
  onCardClick?: React.MouseEventHandler<HTMLDivElement>;
  hasCoverSelector?: boolean;
  name?: string;
  collectionName?: string;
  size?: SizeVariants;
  imageUrl?: string[];
  isCover?: boolean;
}

const checkedIconSizeBySizeVariant = {
  small: {
    width: "24px",
    height: "24px",
  },
  medium: {
    width: "32px",
    height: "32px",
  },
};

const verifiedMarginTopBySizeVariant = {
  small: 0,
  medium: "6px",
};

export function StargazeNFTCard({
  checked,
  verified,
  onCardClick,
  name,
  collectionName,
  size = "medium",
  imageUrl,
  isCover = false,
  hasCoverSelector = false,
}: Pick<
  NFTCardProps,
  | "verified"
  | "onCardClick"
  | "checked"
  | "size"
  | "collectionName"
  | "isCover"
  | "hasCoverSelector"
> &
  Token) {
  // const { t } = useTranslation('common')
  return (
    <CardContainer checked={checked} onClick={onCardClick} isCover={isCover}>
      <ImageSection>
        {!imageUrl ? (
          <ImagePlaceholder width="85px" height="80px" />
        ) : (
          <Image
            alt="img"
            width={500}
            height={500}
            objectFit="cover"
            objectPosition="center"
            src={getImageUrl(imageUrl) ?? []}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        )}
        {checked && (
          <RightImageArea>
            <CheckedOutlineIcon {...checkedIconSizeBySizeVariant[size]} />
          </RightImageArea>
        )}

        {hasCoverSelector && (
          <CoverLabel className="coverLabel" isCover={isCover}>
            {isCover
              ? //  t('common:cover')
                "cover"
              : //   t('common:set-as-cover')
                "set-as-cover"}
          </CoverLabel>
        )}
      </ImageSection>
      <DescriptionSection size={size}>
        <OverflowTip>
          <Title size={size}>{name}</Title>
        </OverflowTip>
        <Flex>
          <OverflowTip>
            <Subtitle size={size}>{collectionName}</Subtitle>
          </OverflowTip>
          {verified && (
            <Box ml={["4px"]} mt={verifiedMarginTopBySizeVariant[size]}>
              <VerifiedIcon />
            </Box>
          )}
        </Flex>
      </DescriptionSection>
    </CardContainer>
  );
}
function NFTCard({
  checked,
  verified,
  onCardClick,
  hasCoverSelector,
  name,
  collectionName,
  size = "medium",
  isCover,
  imageUrl,
}: NFTCardProps) {
  // const { t } = useTranslation('common')
  return (
    <CardContainer checked={checked} onClick={onCardClick} isCover={isCover}>
      <ImageSection>
        {imageUrl?.every((img) => img === "") ? (
          <ImagePlaceholder width="85px" height="80px" />
        ) : isVideo(imageUrl?.at(0) ?? "") ? (
          <video controls src={imageUrl?.at(0)}></video>
        ) : (
          <Image
            alt="Unable to view image"
            width={500}
            height={500}
            objectFit="cover"
            objectPosition="center"
            src={imageUrl?.at(0) ?? ""}
          />
        )}
        {checked && (
          <RightImageArea>
            <CheckedOutlineIcon {...checkedIconSizeBySizeVariant[size]} />
          </RightImageArea>
        )}

        {hasCoverSelector && (
          <CoverLabel className="coverLabel" isCover={isCover}>
            {isCover
              ? //  t('common:cover')
                "cover"
              : //   t('common:set-as-cover')
                "set-as-cover"}
          </CoverLabel>
        )}
      </ImageSection>
      <DescriptionSection size={size}>
        <OverflowTip>
          <Title size={size}>{name}</Title>
        </OverflowTip>
        <Flex>
          <OverflowTip>
            <Subtitle size={size}>{collectionName}</Subtitle>
          </OverflowTip>
          {verified && (
            <Box ml={["4px"]} mt={verifiedMarginTopBySizeVariant[size]}>
              <VerifiedIcon />
            </Box>
          )}
        </Flex>
      </DescriptionSection>
    </CardContainer>
  );
}

NFTCard.defaultProps = {
  isCover: false,
  checked: false,
  hasCoverSelector: false,
  verified: false,
  onCardClick: noop,
  name: "",
  collectionName: "",
  size: "medium",
  imageUrl: [],
};

export default NFTCard;
