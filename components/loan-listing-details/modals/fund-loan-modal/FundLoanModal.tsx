import React from "react";
import { Flex, IconButton } from "theme-ui";
// import { useTranslation } from 'next-i18next'

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useTheme } from "@emotion/react";

import { ModalCloseIcon } from "@/assets/icons/modal";

import {
  Button,
  Modal,
  RadioInputGroupProvider,
  RadioCardInput as RadioCard,
} from "@/components/ui";

import { FormProvider, useForm } from "react-hook-form";
import getShortText from "@/utils/js/getShortText";
import { ModalLayoutContainer } from "@/components/layout";

import { TextAreaField } from "@/components/form";
import { Loan } from "@/services/api/loansService";
import {
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalContent,
  Title,
  Subtitle,
  RadioText,
} from "./FundLoanModal.styled";
import { Collateral } from "@/types/loan/types";

export interface FundLoanOfferModalProps {
  loan: Collateral["collateral"];
  borrower: string;
}

export interface FundLoanOfferModalResult {
  comment: string;
}
export interface FundLoanOfferModalState {
  comment: string;
}

enum CONFIRM_STATUS_TYPE {
  DEFAULT = "0",
  CONFIRMED = "1",
}

const FundLoanOfferModal = NiceModal.create(
  ({ loan, borrower }: FundLoanOfferModalProps) => {
    const modal = useModal();

    // const { t } = useTranslation(['common', 'loan-listings'])

    const [confirmStatus, setConfirmStatus] = React.useState(
      CONFIRM_STATUS_TYPE.DEFAULT
    );

    const theme = useTheme();

    const formMethods = useForm<FundLoanOfferModalState>({
      mode: "all",
      defaultValues: {
        comment: "",
      },
    });

    const { register } = formMethods;

    const onSubmit = ({ comment }: { comment: string }) => {
      modal.resolve({
        comment,
      } as FundLoanOfferModalResult);
      modal.remove();
    };

    return (
      <Modal isOverHeader isOpen={modal.visible} onCloseModal={modal.remove}>
        <ModalContainer>
          <ModalLayoutContainer>
            <ModalContent>
              <ModalHeader>
                {/* {t('loan-listings:fund-loan-modal.title')} */}
                Fund Loan Listing
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
                <FormProvider {...formMethods}>
                  <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                    <Flex sx={{ flexDirection: "column", gap: "24px" }}>
                      <Flex sx={{ flexDirection: "column" }}>
                        <Title>
                          {/* {t('loan-listings:fund-loan-modal.question', {
														username: getShortText(loan?.borrower ?? '', 8),
													})} */}
                          Are you sure you&apos;d like to fund listing from{" "}
                          {getShortText(borrower ?? "", 8)} ?
                        </Title>
                        <Subtitle>
                          {/* {t('loan-listings:fund-loan-modal.note')} */}
                          Feel free to send include a message. How exciting!
                        </Subtitle>
                      </Flex>

                      <RadioInputGroupProvider
                        name="confirmStatus"
                        value={confirmStatus}
                        onChange={(e) =>
                          setConfirmStatus(
                            e.target.value as CONFIRM_STATUS_TYPE
                          )
                        }
                      >
                        <RadioCard value={CONFIRM_STATUS_TYPE.CONFIRMED}>
                          <RadioText>
                            {/* {t('loan-listings:fund-loan-modal.radio-text')} */}
                          </RadioText>
                        </RadioCard>
                      </RadioInputGroupProvider>

                      <Flex sx={{ flexDirection: "column" }}>
                        <TextAreaField
                          label="Yes, I'm absolutely sure. Fund this listing" //{t('loan-listings:fund-loan-modal:send-message')}
                          id="comment"
                          style={{ height: "128px" }}
                          {...register("comment")}
                          placeholder="Enter text" //{t('loan-listings:fund-loan-modal:enter-text')}
                        />
                      </Flex>
                      <Flex
                        sx={{
                          gap: "12px",
                          marginTop: "24px",
                        }}
                      >
                        <Button
                          onClick={modal.remove}
                          variant="secondary"
                          fullWidth
                        >
                          {/* {t('loan-listings:fund-loan-modal.back-to-listing')} */}
                          Back to Listing
                        </Button>
                        <Button
                          variant="gradient"
                          disabled={
                            confirmStatus === CONFIRM_STATUS_TYPE.DEFAULT
                          }
                          fullWidth
                          type="submit"
                        >
                          {/* {t('loan-listings:fund-loan-modal.accept-offer')} */}
                          Fund Loan
                        </Button>
                      </Flex>
                    </Flex>
                  </form>
                </FormProvider>
              </ModalBody>
            </ModalContent>
          </ModalLayoutContainer>
        </ModalContainer>
      </Modal>
    );
  }
);
export default FundLoanOfferModal;
