import React from "react";
import { Box, Flex, IconButton } from "theme-ui";
// import { useTranslation } from 'next-i18next'

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useTheme } from "@emotion/react";

import {
  ModalCloseIcon,
  ModalSuccessCircleIcon,
} from "../../../../assets/icons/modal";

import { Button, Modal } from "../../../../components/ui";

import * as ROUTES from "../../../../constants/routes";
import { useRouter } from "next/router";
import getShortText from "../../../../utils/js/getShortText";
import { ModalLayoutContainer } from "../../../../components/layout";
import { Loan } from "../../../../services/api/loansService";
import {
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalContent,
  Title,
  Subtitle,
} from "./SubmitLoanOfferSuccessModal.styled";
import { Collateral } from "@/types/loan/types";

export interface SubmitLoanOfferSuccessModalProps {
  loan: Collateral["collateral"];
  borrower: string;
  loanId: string;
}

const SubmitLoanOfferSuccessModal = NiceModal.create(
  ({ loan, borrower ,loanId}: SubmitLoanOfferSuccessModalProps) => {
    const modal = useModal();

    // const { t } = useTranslation(['common', 'loan-listings'])

    const theme = useTheme();

    const router = useRouter();

    return (
      <Modal isOverHeader isOpen={modal.visible} onCloseModal={modal.remove}>
        <ModalContainer>
          <ModalLayoutContainer>
            <ModalContent>
              <ModalHeader>
                Success
                {/* {t('loan-listings:submit-loan-offer-success-modal.title')} */}
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
                <Flex sx={{ gap: "8px" }}>
                  <Box sx={{ minWidth: "32px", minHeight: "32px" }}>
                    <ModalSuccessCircleIcon />
                  </Box>
                  <Box>
                    <Title>
                      {getShortText(borrower ?? "", 8)}
                      {/* {t('loan-listings:submit-loan-offer-success-modal.question', {
												username: getShortText(borrower ?? '', 8),
											})}
 */}
                    </Title>
                    <Subtitle>
						Note
                      {/* {t("loan-listings:submit-loan-offer-success-modal.note")} */}
                    </Subtitle>
                  </Box>
                </Flex>
                <Box />
                <Flex
                  sx={{
                    justifyContent: "space-between",
                    gap: "12px",
                    marginTop: "24px",
                  }}
                >
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      router.push(ROUTES.LOAN_LISTINGS);
                      modal.remove();
                    }}
                  >
                    {/* {t(
                      "loan-listings:submit-loan-offer-success-modal.view-all-listings"
                    )} */}
					View all listings
                  </Button>
                  <Button
                    variant="gradient"
                    fullWidth
                    onClick={() => {
                      router.push(
                        `${ROUTES.LOAN_LISTING_DETAILS}?loanId=${loanId}&borrower=${borrower}`
                      );
                      modal.remove();
                    }}
                  >
                    {/* {t(
                      "loan-listings:submit-loan-offer-success-modal.go-to-listing"
                    )} */}
					Go to listing
                  </Button>
                </Flex>
              </ModalBody>
            </ModalContent>
          </ModalLayoutContainer>
        </ModalContainer>
      </Modal>
    );
  }
);
export default SubmitLoanOfferSuccessModal;
