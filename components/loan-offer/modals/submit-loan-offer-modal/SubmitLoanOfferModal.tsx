import React from "react";
import { Box, Flex, IconButton } from "theme-ui";
// import { useTranslation } from 'next-i18next'

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useTheme } from "@emotion/react";

import { ModalCloseIcon } from "../../../../assets/icons/modal";

import { Button, Modal } from "../../../../components/ui";

import * as ROUTES from "../../../../constants/routes";
import { useRouter } from "next/router";
import {
  ModalLayoutContainer,
  OnlyMobileAndTablet,
  OnlyOnDesktop,
} from "../../../../components/layout";
import { NFT } from "../../../../services/api/walletNFTsService";
import ImagePlaceholder from "../../../../assets/images/ImagePlaceholder";

import { StarIcon } from "../../../../assets/icons/mixed";

import { Loan } from "../../../../services/api/loansService";
import {
  HorizontalLoanLine,
  VerticalLoanLine,
} from "../../../../components/loan-listing-details";
import {
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalContent,
  Title,
  Subtitle,
  Grid,
  PreviewImageContainer,
  PreviewImage,
  OfferCard,
  OfferCardTitle,
  OfferCardSubtitle,
} from "./SubmitLoanOfferModal.styled";
import { Collateral } from "@/types/loan/types";
import { useToken } from "@/hooks/useTokens";
import { getImageUrl } from "@/lib/getImageUrl";

export interface SubmitLoanOfferModalProps {
  loan: Collateral["collateral"];
  tokenAmount: string;
  tokenName: string;
  interestRate: string;
  loanPeriod: string;
  comment: string;
  loanId: string;
  borrower: string;
}
const SubmitLoanOfferModal = NiceModal.create(
  ({
    loan,
    borrower,
    loanId,
    tokenAmount,
    tokenName,
    interestRate,
    loanPeriod,
  }: SubmitLoanOfferModalProps) => {
    const modal = useModal();

    // const { t } = useTranslation(['common', 'loan-listings'])

    const theme = useTheme();

    const router = useRouter();

    const loanNFTs = React.useMemo(
      () =>
        (loan?.associated_assets ?? [])
          .filter(({ sg721_token }) => sg721_token)
          .map(({ sg721_token }) => sg721_token),
      [loan]
    );
    const { data: nfts } = useToken(loanNFTs, [
      ...(loan?.associated_assets ?? [])?.map(
        (res) => res?.sg721_token?.token_id
      ),
    ]);
    console.log({ nfts });
    return (
      <Modal isOverHeader isOpen={modal.visible} onCloseModal={modal.remove}>
        <ModalContainer>
          <ModalLayoutContainer>
            <ModalContent>
              <ModalHeader>
                Title
                {/* {t('loan-listings:submit-loan-offer-modal.title')} */}
                <IconButton
                  sx={{
                    borderRadius: "32px",
                    backgroundColor: theme.colors.dark500,
                  }}
                  onClick={modal.remove}
                >
                  <ModalCloseIcon />
                </IconButton>
              </ModalHeader>
              <ModalBody>
                <Box>
                  <Title>Questions</Title>
                  {/* <Title>{t('loan-listings:submit-loan-offer-modal.question')}</Title> */}
                  <Subtitle>
                    Answer
                    {/* {t('loan-listings:submit-loan-offer-modal.answer')} */}
                  </Subtitle>
                </Box>

                <Flex
                  sx={{
                    flexDirection: ["column", "column", "row"],
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Title>
                      Counter Offer{" "}
                      {/* {t('loan-listings:submit-loan-offer-modal.counter-offer')} */}
                    </Title>
                    <Flex sx={{ flexDirection: "column", gap: 8 }}>
                      <OfferCard>
                        <OfferCardTitle>
                          Loan Period
                          {/* {t('loan-listings:submit-loan-offer-modal.loan-period')} */}
                        </OfferCardTitle>
                        <OfferCardSubtitle>
                          {loanPeriod} days
                          {/* {t("loan-listings:days", {
                            count: +loanPeriod,
                          })} */}
                        </OfferCardSubtitle>
                      </OfferCard>

                      <OfferCard>
                        <OfferCardTitle>
                          Amount
                          {/* {t(
                            "loan-listings:submit-loan-offer-modal.loan-amount"
                          )} */}
                        </OfferCardTitle>
                        <OfferCardSubtitle>
                          <Flex>
                            {Number(tokenAmount).toFixed(3)}
                            {tokenName}
                            {/* {t(
                              "loan-listings:submit-loan-offer-modal.loan-currency",
                              {
                                tokenAmount: Number(tokenAmount).toFixed(3),
                                tokenName,
                              }
                            )} */}
                            <Box sx={{ ml: 8 }}>
                              <StarIcon />
                            </Box>
                          </Flex>
                        </OfferCardSubtitle>
                      </OfferCard>

                      <OfferCard>
                        <OfferCardTitle>
                          {/* {t("loan-listings:submit-loan-offer-modal.interest")} */}
                          interest
                        </OfferCardTitle>
                        <OfferCardSubtitle>
                          {(+interestRate / 100) * +tokenAmount} {tokenName}
                          {/* {t(
                            "loan-listings:submit-loan-offer-modal.interest-description",
                            {
                              apr: interestRate,
                              amount: (+interestRate / 100) * +tokenAmount,
                              tokenName,
                            }
                          )} */}
                        </OfferCardSubtitle>
                      </OfferCard>
                    </Flex>
                  </Box>
                  <OnlyMobileAndTablet>
                    <HorizontalLoanLine />
                  </OnlyMobileAndTablet>
                  <OnlyOnDesktop>
                    <VerticalLoanLine />
                  </OnlyOnDesktop>
                  <Flex
                    sx={{
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <Title>
                      Nft Collateral
                      {/* {t(
                        "loan-listings:submit-loan-offer-modal.nft-collateral"
                      )} */}
                    </Title>
                    <Grid>
                      {loanNFTs.map((nft) => (
                        <PreviewImageContainer
                          key={`${nft.address}_${nft.token_id}`}
                        >
                          {!nfts?.at(0)?.token?.imageUrl ? (
                            <Flex sx={{ maxWidth: "61px", maxHeight: "61px" }}>
                              <ImagePlaceholder width="100%" height="100%" />
                            </Flex>
                          ) : (
                            <PreviewImage
                              src={getImageUrl(nfts?.at(0)?.token?.imageUrl!) ?? []}
                            />
                          )}
                        </PreviewImageContainer>
                      ))}
                    </Grid>
                  </Flex>
                </Flex>

                <Flex
                  sx={{
                    justifyContent: [null, null, "space-between"],
                    flexDirection: ["column", "column", "row"],
                    mt: ["24px", "24px", "48px"],
                  }}
                >
                  <Flex
                    sx={{
                      flex: [1, 1, "unset"],
                      display: ["flex", "flex", "block"],
                    }}
                  >
                    <Button
                      variant="dark"
                      fullWidth
                      onClick={() => {
                        router.push(
                          `${ROUTES.LOAN_LISTING_DETAILS}?loanId=${loanId}&borrower=${borrower}`
                        );
                        modal.remove();
                      }}
                    >
                      Back to listing
                      {/* {t(
                        "loan-listings:submit-loan-offer-modal.back-to-listing"
                      )} */}
                    </Button>
                  </Flex>

                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      gap: "12px",
                      mt: ["12px", "12px", 0],
                    }}
                  >
                    <Flex
                      sx={{
                        flex: [1, 1, "unset"],
                        display: ["flex", "flex", "block"],
                      }}
                    >
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={modal.remove}
                      >
                        {/* {t("loan-listings:submit-loan-offer-modal.edit-offer")} */}
                        Edit offer
                      </Button>
                    </Flex>
                    <Flex
                      sx={{
                        flex: [1, 1, "unset"],
                        display: ["flex", "flex", "block"],
                      }}
                    >
                      <Button
                        variant="gradient"
                        fullWidth
                        onClick={() => {
                          modal.resolve(true);
                          modal.remove();
                        }}
                      >
                        {/* {t(
                          "loan-listings:submit-loan-offer-modal.submit-offer"
                        )} */}
                        Submit Offer
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </ModalBody>
            </ModalContent>
          </ModalLayoutContainer>
        </ModalContainer>
      </Modal>
    );
  }
);
export default SubmitLoanOfferModal;
