import React from "react";
import { Box, Flex, IconButton } from "theme-ui";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useTheme } from "@emotion/react";

import { ModalCloseIcon } from "@/assets/icons/modal";

import { Button, Modal } from "@/components/ui";

import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ModalLayoutContainer } from "@/components/layout";

import { RaffleBuyTicketSchema } from "@/constants/validation-schemas/raffle";

import { TextInputField } from "@/components/form";
import TicketImage from "@/assets/images/TicketImage";
import {
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalContent,
  ModalActions,
  Title,
  Subtitle,
} from "./BuyTicketModal.styled";

export interface BuyTicketModalResult {
  ticketNumber: string;
}

export interface BuyTicketModalPropsState {
  ticketNumber: string;
}

const BuyTicketModal = NiceModal.create(() => {
  const modal = useModal();

  // 	const { t } = useTranslation(['common', 'raffle-listings'])

  const theme = useTheme();

  const formMethods = useForm<BuyTicketModalPropsState>({
    mode: "all",
    resolver: yupResolver(RaffleBuyTicketSchema),
    defaultValues: {
      ticketNumber: "",
    },
  });

  const {
    register,
    formState: { errors, isValid },
  } = formMethods;

  const onSubmit = ({ ticketNumber }: BuyTicketModalPropsState) => {
    modal.resolve({
      ticketNumber,
    } as BuyTicketModalResult);
    modal.remove();
  };

  return (
    <Modal
      disableDismissOnOutsideClick
      isOverHeader
      isOpen={modal.visible}
      onCloseModal={modal.remove}
    >
      <ModalContainer>
        <ModalLayoutContainer>
          <ModalContent>
            <ModalHeader>
              <div>Buy ticket</div>
              {/* <div>{t('raffle-listings:buy-ticket-modal.title')}</div> */}
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
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                <ModalBody>
                  <Flex sx={{ gap: "8px" }}>
                    <Box>
                      <TicketImage />
                    </Box>
                    <Box>
                      <Title>
                        {/* {t('raffle-listings:buy-ticket-modal.selecting-amount-of-tickets')} */}
                        Amount of tickets
                      </Title>
                      <Subtitle>
                        {/* {t(
													'raffle-listings:buy-ticket-modal.feel-free-to-add-amount-of-tickets'
												)} */}
                      </Subtitle>
                      feel free to add amount of tickets
                    </Box>
                  </Flex>
                  <Flex sx={{ mt: "12px", flexDirection: "column" }}>
                    <TextInputField
                      label={"ticket number"}

                      id="ticketNumber"
                      {...register("ticketNumber")}
                      fieldError={
                        errors.ticketNumber &&
                        `common:errors.${errors.ticketNumber.message}`
                      }
                      error={!!errors.ticketNumber}
                      //   placeholder={t(
                      //     "raffle-listings:buy-ticket-modal:enter-amount"
                      //   )}
                      placeholder={"enter-amount"}
                    />
                  </Flex>

                  <ModalActions>
                    <Button
                      disabled={!isValid}
                      variant="gradient"
                      fullWidth
                      type="submit"
                    >
                      Preview Purchase
                      {/* {t("raffle-listings:buy-ticket-modal.preview-purchase")} */}
                    </Button>
                  </ModalActions>
                </ModalBody>
              </form>
            </FormProvider>
          </ModalContent>
        </ModalLayoutContainer>
      </ModalContainer>
    </Modal>
  );
});
export default BuyTicketModal;
