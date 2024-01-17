import NiceModal from "@ebay/nice-modal-react";
import { Box, Flex, Text } from "theme-ui";
// import { useTranslation } from 'next-i18next'
import { useFormContext } from "react-hook-form";

import LoanAssetImage from "@/assets/images/TradeAsset";
import { Button } from "@/components/ui";
import { NFT } from "@/services/api/walletNFTsService";
import { NFTCard } from "@/components/shared";
import {
  MyNFTsModal,
  MyNFTsModalProps,
} from "@/components/shared/modals/my-nfts-modal";
import { asyncAction } from "@/utils/js/asyncAction";
import { LoanFormStepsProps } from "@/types";
import { NavigationFooter } from "@/components/shared/navigation-footer";
import {
  ContentCard,
  ContentCardSubtitle,
  ContentCardTitle,
  ContentCardTitleChip,
  ListOfSelectedNFTsCard,
  ListOfSelectedNFTsHeader,
  NFTCardsContainer,
  LoanAssetImageContainer,
} from "./SelectNFTs.styled";
import { StargazeNFTCard } from "../shared/nft-card/NFTCard";

interface SelectNFTProps {
  goNextStep: () => void;
  goBackStep: () => void;
}

const ListOfSelectedNFTs = ({ goBackStep, goNextStep }: SelectNFTProps) => {
  const { setValue, getValues, watch } = useFormContext<LoanFormStepsProps>();
  // const { t } = useTranslation(['common', 'loan'])
  const selectedCoverNFT = watch("coverNFT") || getValues("selectedNFTs")[0];

  return (
    <Flex sx={{ flexDirection: "column", flex: 1 }}>
      <ListOfSelectedNFTsCard>
        <ListOfSelectedNFTsHeader>
          <div>
            <ContentCardTitle sx={{ textAlign: "left" }}>
              {/* {t('loan:select-NFTs.selected-nfts')} */}
              Selected NFT&apos;s
              <ContentCardTitleChip>
                {/* {t('common:nft', { count: getValues('selectedNFTs').length })} */}
                {getValues("selectedNFTs").length} NFT&apos;s
              </ContentCardTitleChip>
            </ContentCardTitle>
            <ContentCardSubtitle sx={{ textAlign: "left" }}>
              {/* {t('loan:select-NFTs.selected-nfts-description')} */}
              These items will be included in the loan listing
            </ContentCardSubtitle>
          </div>
          <Button
            sx={{
              marginLeft: [null, "auto"],
              marginTop: ["8px", "0px"],
            }}
            variant="dark"
            onClick={async (e) => {
              e.preventDefault();

              const [, NFTs] = await asyncAction<NFT[]>(
                NiceModal.show(MyNFTsModal, {
                  selectedNFTs: getValues("selectedNFTs"),
                  title: "My NFTs", // t('common:my-nfts'),
                  addNFTsButtonLabel: "Add NFTs to Loan", // t('common:add-nfts-to-loan'),
                } as MyNFTsModalProps)
              );

              if (NFTs) {
                const [defaultCoverNFT] = NFTs;
                setValue("selectedNFTs", NFTs);
                setValue("coverNFT", defaultCoverNFT);
              }
            }}
          >
            {/* {t('common:buttons.select-more')} */}
            Select More
          </Button>
        </ListOfSelectedNFTsHeader>
        <NFTCardsContainer>
          {getValues("selectedNFTs").map((selectedNFT) => {
            return (
              <StargazeNFTCard
                key={`${selectedNFT.collectionAddress}_${selectedNFT.tokenId}`}
                {...selectedNFT}
                size="small"
                isCover={
                  `${selectedNFT.collectionAddress}_${selectedNFT.tokenId}` ===
                  `${selectedCoverNFT.collectionAddress}_${selectedCoverNFT.tokenId}`
                }
                hasCoverSelector
                onCardClick={() => setValue("coverNFT", selectedNFT)}
              />
            );
          })}
        </NFTCardsContainer>
      </ListOfSelectedNFTsCard>
      {/* Footer Navigation Section */}
      <NavigationFooter
        goBackStep={goBackStep}
        goNextStep={goNextStep}
        isBackButtonDisabled
      />
    </Flex>
  );
};

const SelectNFTsEmpty = () => {
  // const { t } = useTranslation(['common', 'loan'])
  const { setValue, getValues } = useFormContext<LoanFormStepsProps>();

  return (
    <ContentCard>
      <LoanAssetImageContainer>
        <LoanAssetImage />
      </LoanAssetImageContainer>

      <Box sx={{ mb: ["2px"] }}>
        <ContentCardTitle>
          {/* {t('loan:select-NFTs:question')} */}
          Which NFTs are you looking to provide as collateral
        </ContentCardTitle>
      </Box>
      <Box sx={{ mb: ["16px"] }}>
        <ContentCardSubtitle>
          {/* {t('loan:select-NFTs:add-instruction')} */}
          Add them here by clicking below
        </ContentCardSubtitle>
      </Box>

      <Button
        sx={{ minWidth: ["140px"] }}
        onClick={async (e) => {
          e.preventDefault();
          const [, NFTs] = await asyncAction<NFT[]>(
            NiceModal.show(MyNFTsModal, {
              selectedNFTs: getValues("selectedNFTs"),
              title: "My NFTs", // t('common:my-nfts'),
              addNFTsButtonLabel: "Add NFTs to Loan", //  t('common:add-nfts-to-loan'),
            } as MyNFTsModalProps)
          );

          if (NFTs) {
            const [defaultCoverNFT] = NFTs;
            setValue("selectedNFTs", NFTs);
            setValue("coverNFT", defaultCoverNFT);
          }
        }}
        fullWidth
        variant="gradient"
      >
        <Text variant="textSmMedium">
          {/* {t('loan:select-NFTs:select-nfts')} */}
          Select NFTs
        </Text>
      </Button>
    </ContentCard>
  );
};

export const SelectNFTs = ({ goNextStep, goBackStep }: SelectNFTProps) => {
  const { watch } = useFormContext<LoanFormStepsProps>();
  const watchSelectedNFTs = watch("selectedNFTs");

  return !watchSelectedNFTs.length ? (
    <SelectNFTsEmpty />
  ) : (
    <ListOfSelectedNFTs goBackStep={goBackStep} goNextStep={goNextStep} />
  );
};
