import React from "react";
import { Flex, IconButton } from "theme-ui";
// import { useTranslation } from 'next-i18next'

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useTheme } from "@emotion/react";

import { ModalCloseIcon } from "@/assets/icons/modal";

import { Button, Modal } from "@/components/ui";

import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextAreaField,
  TextInputField,
  TokenInputField,
} from "@/components/form";
import { ModalLayoutContainer } from "@/components/layout";

import { RaffleDetailsStepSchema } from "@/constants/validation-schemas/raffle";
import { DatePickerField } from "@/components/form/fields/date-picker-field";
import { TimePickerField } from "@/components/form/fields/time-picker-field";
import moment from "moment";
import {
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalContent,
  ModalActions,
} from "./EditModal.styled";

export interface EditModalProps {
  initialComment?: string;
  initialEndDate?: Date;
  initialEndTime?: Date;
  initialTicketSupply?: string;
  initialTicketPrice?: string;
  initialTicketPriceCurrency?: string;
}

export interface EditModalResult {
  comment?: string;
  endDate?: Date;
  endTime?: Date;
  ticketSupply?: string;
  ticketPrice?: string;
  ticketPriceCurrency?: string;
}

export interface EditModalPropsState {
  comment?: string;
  endDate?: Date;
  endTime?: Date;
  ticketSupply?: string;
  ticketPrice?: string;
  ticketPriceCurrency?: string;
}

const EditModal = NiceModal.create(
  ({
    initialComment,
    initialEndDate,
    initialEndTime,
    initialTicketSupply,
    initialTicketPrice,
    initialTicketPriceCurrency,
  }: EditModalProps) => {
    const modal = useModal();

    // 	const { t } = useTranslation(['common', 'raffle-listings'])

    const theme = useTheme();

    const formMethods = useForm<EditModalPropsState>({
      mode: "all",
      resolver: yupResolver(RaffleDetailsStepSchema),
      defaultValues: {
        comment: initialComment,
        endDate: initialEndDate,
        endTime: initialEndTime,
        ticketSupply: initialTicketSupply,
        ticketPrice: initialTicketPrice,
        ticketPriceCurrency: initialTicketPriceCurrency,
      },
    });

    const {
      register,
      getValues,
      setValue,
      formState: { errors },
    } = formMethods;

    const onSubmit = ({
      comment,
      endDate,
      endTime,
      ticketSupply,
      ticketPrice,
      ticketPriceCurrency,
    }: EditModalPropsState) => {
      modal.resolve({
        comment,
        endDate,
        endTime,
        ticketSupply,
        ticketPrice,
        ticketPriceCurrency,
      } as EditModalResult);
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
                Edit
                {/* {t('raffle-listings:edit-modal.title')} */}
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
                    <Flex sx={{ flexDirection: "column" }}>
                      <Flex
                        sx={{
                          flexDirection: ["column", "row"],
                          gap: ["0", "8px"],
                        }}
                      >
                        <DatePickerField
                          label={"end date"}
                          // label={t('raffle-listings:edit-modal.end-date-label')}
                          id="endDate"
                          value={getValues("endDate")}
                          onChange={([date]) =>
                            setValue("endDate", date, {
                              shouldValidate: true,
                            })
                          }
                          minDate={moment()
                            .add("1", "day")
                            .startOf("day")
                            .toDate()}
                          fieldError={
                            errors.endDate && `${errors?.endDate?.message}`
                            // t()
                          }
                          error={!!errors.endDate}
                          placeholder={`enter date`}
                        />

                        <TimePickerField
                          id="endTime"
                          label={`end time`}
                          help={"help"}
                          value={getValues("endTime")}
                          onChange={([date]) =>
                            setValue("endTime", date, {
                              shouldValidate: true,
                            })
                          }
                          fieldError={
                            errors.endTime && `${errors?.endTime?.message}`
                          }
                          error={!!errors.endTime}
                          placeholder={`enter time`}
                        />
                      </Flex>
                      <Flex sx={{ flexDirection: ["row", "column"] }}>
                        <TextInputField
                          label={"ticket supply"}
                          id="ticketSupply"
                          {...register("ticketSupply")}
                          fieldError={
                            errors.ticketSupply && errors?.ticketSupply?.message
                          }
                          error={!!errors.ticketSupply}
                          placeholder={"enter ticket"}
                        />
                        <TokenInputField
                          label={"ticket price"}
                          id="ticketPrice"
                          {...register("ticketPrice")}
                          fieldError={
                            errors.ticketPrice && errors.ticketPrice.message
                          }
                          error={!!errors.ticketPrice}
                          placeholder={`edit modal tokens
                            ${getValues("ticketPriceCurrency")}
                          `}
                          tokenName={getValues("ticketPriceCurrency")}
                        />
                      </Flex>
                    </Flex>

                    <TextAreaField
                      label={"write comment"}
                      id="comment"
                      style={{ height: "128px" }}
                      {...register("comment")}
                      placeholder={"write comment"}
                    />
                    <ModalActions>
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={modal.remove}
                      >
                        discard changes
                        {/* {t("raffle-listings:edit-modal.")} */}
                      </Button>
                      <Button variant="gradient" fullWidth type="submit">
                        {/* {t("raffle-listings:edit-modal.")} */}
                        update listing
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
  }
);
export default EditModal;
