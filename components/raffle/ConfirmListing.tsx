import { LunaIcon, TwitterIcon } from "@/assets/icons/mixed";
import ConfirmListingSuccessImage from "@/assets/images/ConfirmListingSuccessImage";
import If from "@/components/core/if-statement";
import { theme } from "@/constants/theme";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { CopyField } from "@/components/shared";
import { NFTCard } from "@/components/shared/nft-card";
// import { useTranslation } from 'next-i18next'
import { Dispatch, ReactNode, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { Box, Flex } from "theme-ui";
import { noop } from "lodash";

// import { TwitterShareButton } from 'react-share'
import { NavigationFooter } from "@/components/shared/navigation-footer";
import { RaffleFormStepsProps } from "@/types/raffle";
import { CREATE_RAFFLE_LISTING_FORM_STEPS } from "@/constants/steps";
import moment from "moment";
import { TicketOutlineIcon } from "@/assets/icons/20ptOutline";
import {
  ContentCard,
  ContentCardSubtitle,
  ContentCardTitle,
  ContentCardWrapper,
  EditButton,
  NFTCardsContainer,
  NoContent,
  StepTitle,
  SuccessLabel,
  SuccessMessage,
  SuccessTitle,
} from "./ConfirmListing.styled";
import { StargazeNFTCard } from "../shared/nft-card/NFTCard";

interface StepHeaderProps {
  children: ReactNode;
  onEditClick: () => void;
}

interface SuccessScreenProps {
  setStep: Dispatch<SetStateAction<number>>;
}
interface Props {
  goBackStep: () => void;
  setStep: Dispatch<SetStateAction<number>>;
  canGoToNextStep: boolean;
}

const StepHeader = ({ children, onEditClick }: StepHeaderProps) => {
  // const { t } = useTranslation(['common'])

  return (
    <Flex style={{ justifyContent: "space-between", alignItems: "baseline" }}>
      {children}
      <EditButton onClick={onEditClick}>
        {/* {t('common:edit')} */}
        Edit
      </EditButton>
    </Flex>
  );
};

const SuccessScreen = ({ setStep }: SuccessScreenProps) => {
  // const { t } = useTranslation(['common', 'raffle'])
  const { reset, watch, getValues } = useFormContext<RaffleFormStepsProps>();
  const raffleDetailsUrl = getValues("raffleDetailsUrl");

  return (
    <Flex sx={{ flexDirection: "column", gap: "16px" }}>
      <ContentCard sx={{ padding: ["16px 12px 32px", "24px 12px 40px"] }}>
        <Flex
          sx={{
            margin: "auto",
            alignItems: "center",
            flexDirection: "column",
            maxWidth: "314px",
          }}
        >
          <ConfirmListingSuccessImage />
          <SuccessTitle>
            {/* {t('raffle:confirm-listing.congratulations')} */}
            Congratulations!
          </SuccessTitle>
          <SuccessMessage>
            {/* {t('raffle:confirm-listing.congratulations-message')} */}
            Your Raffle has been successfully created
          </SuccessMessage>
          <Flex sx={{ justifyContent: "center", gap: "12px" }}>
            <Button
              variant="primary"
              onClick={() => {
                reset();
                setStep(CREATE_RAFFLE_LISTING_FORM_STEPS.SELECT_NFTS);
              }}
            >
              {/* {t('common:create-another')} */}
              Create Another
            </Button>
            {/* <TwitterShareButton
							title={t('common:checkout-my-raffle')}
							url={raffleDetailsUrl}
						>
							<Button onClick={e => e.preventDefault()} variant='dark'>
								<Flex pr={2}>
									<TwitterIcon fill={theme.colors.natural50} />
								</Flex>
								{t('common:tweet')}
							</Button>
						</TwitterShareButton> */}
          </Flex>
        </Flex>
      </ContentCard>
      <ContentCard
        sx={{
          padding: ["16px 16px 28px", "24px 24px 36px"],
          display: "flex",
          flexDirection: "column",
          gap: "36px",
        }}
      >
        <Box>
          <SuccessLabel>
            {/* {t('raffle:confirm-listing.your-listing-url')} */}
            Your Raffle URL
          </SuccessLabel>
          <CopyField data={`${watch("raffleDetailsUrl")}`} />
        </Box>
        <Box>
          <SuccessLabel>
            {/* {t('raffle:confirm-listing.transaction-id')} */}
            Transaction ID
          </SuccessLabel>
          <CopyField data={`${watch("explorerUrl")}`} />
        </Box>
      </ContentCard>
    </Flex>
  );
};

export const ConfirmListing = ({
  goBackStep,
  setStep,
  canGoToNextStep,
}: Props) => {
  // const { t } = useTranslation(['common', 'raffle'])
  const { getValues, setValue, watch, handleSubmit } =
    useFormContext<RaffleFormStepsProps>();

  const selectedCoverNFT = watch("coverNFT");
  const selectedNFTs = getValues("selectedNFTs");
  const comment = getValues("comment") || "";
  const isSuccessScreen = watch("isSuccessScreen");
  const ticketSupply = getValues("ticketSupply");
  const ticketPrice = getValues("ticketPrice");
  const ticketPriceCurrency = getValues("ticketPriceCurrency");
  const endTime = getValues("endTime");
  const endDate = getValues("endDate");

  return (
    <ContentCardWrapper>
      <If condition={isSuccessScreen}>
        <If.Then>
          <SuccessScreen setStep={setStep} />
        </If.Then>
        <If.Else>
          <ContentCard>
            <ContentCardTitle>
              {/* {t('raffle:confirm-listing.title-message')} */}
              Confirm Raff
            </ContentCardTitle>
            <ContentCardSubtitle>
              {/* {t('raffle:confirm-listing.instruction')} */}
              Review the details below and make any adjustments
            </ContentCardSubtitle>

            {/* WHAT YOU ARE RAFFLING */}
            <Box>
              <StepHeader
                onEditClick={() =>
                  setStep(CREATE_RAFFLE_LISTING_FORM_STEPS.SELECT_NFTS)
                }
              >
                <StepTitle>
                  {/* {t('raffle:confirm-listing.what-are-you-raffling')} */}
                  What you're raffling
                  <span>
                    {/* {t('common:nft', { count: selectedNFTs.length })} */}
                    {selectedNFTs.length} NFTs
                  </span>
                </StepTitle>
              </StepHeader>

              <NFTCardsContainer>
                {selectedNFTs.map((selectedNFT) => {
                  return (
                    <StargazeNFTCard
                      key={`${selectedNFT.collectionAddr}_${selectedNFT.tokenId}`}
                      {...selectedNFT}
                      size="small"
                      isCover={
                        `${selectedNFT?.collectionAddr!}_${selectedNFT.tokenId!}` ===
                        `${selectedCoverNFT?.collectionAddr!}_${selectedCoverNFT?.tokenId!}`
                      }
                      hasCoverSelector
                      onCardClick={() => setValue("coverNFT", selectedNFT)}
                    />
                  );
                })}
              </NFTCardsContainer>
            </Box>

            {/* RAFFLE END AND START TIME */}
            <Box>
              <StepHeader
                onEditClick={() =>
                  setStep(CREATE_RAFFLE_LISTING_FORM_STEPS.RAFFLE_DETAILS)
                }
              >
                <StepTitle>
                  {/* {t('raffle:confirm-listing.raffle-end-time-and-start-time')} */}
                  Raffle end date and end time
                </StepTitle>
              </StepHeader>
              <Box pb="24px" style={{ width: "fit-content" }}>
                <Chip isViewMode>
                  {moment(
                    `${moment(endDate).format("YYYY-MM-DD")} ${moment(
                      endTime
                    ).format("HH:mm")}`
                  ).toLocaleString()}
                </Chip>
              </Box>
            </Box>
            {/* Ticket Supply */}
            <Box>
              <StepHeader
                onEditClick={() =>
                  setStep(CREATE_RAFFLE_LISTING_FORM_STEPS.RAFFLE_DETAILS)
                }
              >
                <StepTitle>
                  {/* {t('raffle:confirm-listing.raffle-ticket-supply-label')} */}
                  Ticket supply
                </StepTitle>
              </StepHeader>
              <Box pb="24px" style={{ width: "fit-content" }}>
                <Chip isViewMode>
                  <TicketOutlineIcon />
                  {ticketSupply}
                </Chip>
              </Box>
            </Box>
            {/* Ticket Supply */}
            <Box>
              <StepHeader
                onEditClick={() =>
                  setStep(CREATE_RAFFLE_LISTING_FORM_STEPS.RAFFLE_DETAILS)
                }
              >
                <StepTitle>
                  {/* {t('raffle:confirm-listing.raffle-ticket-price-label')} */}
                  Ticket price
                </StepTitle>
              </StepHeader>
              <Box pb="24px" style={{ width: "fit-content" }}>
                <Chip isViewMode>
                  <LunaIcon />
                  <div>{`${ticketPrice} ${ticketPriceCurrency}`}</div>
                </Chip>
              </Box>
            </Box>

            {/* Comment */}
            <Box>
              <StepHeader
                onEditClick={() =>
                  setStep(CREATE_RAFFLE_LISTING_FORM_STEPS.RAFFLE_DETAILS)
                }
              >
                <StepTitle>
                  {/* {t('raffle:confirm-listing.comments')} */}
                  Comments
                </StepTitle>
              </StepHeader>
              <Box pb="24px" style={{ width: "fit-content" }}>
                {comment ? (
                  <Chip isViewMode>{`"${comment}"`}</Chip>
                ) : (
                  <NoContent>
                    {/* {t('raffle:confirm-listing.no-content-comments')} */}
                    No comments specified
                  </NoContent>
                )}
              </Box>
            </Box>
          </ContentCard>

          {/* Footer Navigation Section */}
          <NavigationFooter
            canGoToNextStep={canGoToNextStep}
            goBackStep={goBackStep}
            goNextStep={() => handleSubmit(noop)}
            isNextButtonDisabled={false}
          />
        </If.Else>
      </If>
    </ContentCardWrapper>
  );
};
