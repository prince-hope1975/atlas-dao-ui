import React from "react";
import { Flex, IconButton } from "theme-ui";
// import { useTranslation } from 'next-i18next'

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useTheme } from "@emotion/react";

import { ModalCloseIcon } from "@/assets/icons/modal";

import { Button, Modal } from "@/components/ui";

import { ModalLayoutContainer } from "@/components/layout";
import moment from "moment";
import {
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalContent,
  DescriptionCard,
  DescriptionCardLabel,
  DescriptionCardContent,
} from "./BuyRaffleReviewModal.styled";
import { RaffleResponse } from "@/services/blockchain/contracts/raffles/Raffle.types";
import convertTimestampToDate from "@/lib/convertTimeStampToDate";
import { BLOCKS_PER_DAY, DEFAULT_CURRENCY } from "@/constants/core";
import { formaCurrency } from "@/lib/formatCurrency";

export interface BuyRaffleReviewModalProps {
  raffle: RaffleResponse;
  ticketNumber: number;
}

const BuyRaffleReviewModal = NiceModal.create(
  ({ raffle, ticketNumber }: BuyRaffleReviewModalProps) => {
    const modal = useModal();

    // 	const { t } = useTranslation(['common', 'raffle-listings'])
    console.log({
      raffle,
      date: new Date(
        convertTimestampToDate(
          +(raffle?.raffle_info?.raffle_options?.raffle_start_timestamp ?? 0)
        )
      ).toDateString(),
    });
    const theme = useTheme();

    const endsIn = moment(
      convertTimestampToDate(
        +(raffle?.raffle_info?.raffle_options?.raffle_start_timestamp ?? 0)
      )
    ).add(raffle?.raffle_info?.raffle_options?.raffle_duration ?? 0, "seconds");

    const raffleStartDate = moment(
      convertTimestampToDate(
        +(raffle?.raffle_info?.raffle_options?.raffle_start_timestamp ?? 0)
      )
    );

    return (
      <Modal isOverHeader isOpen={modal.visible} onCloseModal={modal.remove}>
        <ModalContainer>
          <ModalLayoutContainer>
            <ModalContent>
              <ModalHeader>
                buy raffle review modal
                {/* {t("raffle-listings:buy-raffle-review-modal.title")} */}
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
                <Flex sx={{ flexDirection: "column", gap: "12px" }}>
                  <DescriptionCard>
                    <DescriptionCardLabel>
                      {/* {t('raffle-listings:buy-raffle-review-modal.raffle-start-date')} */}
                      Raffle Start Date
                    </DescriptionCardLabel>
                    <DescriptionCardContent>
                      {`${raffleStartDate.format(
                        "MMMM Do YYYY"
                      )} (${raffleStartDate.fromNow()})`}
                    </DescriptionCardContent>
                  </DescriptionCard>

                  <DescriptionCard>
                    <DescriptionCardLabel>
                      {/* {t('raffle-listings:buy-raffle-review-modal.raffle-ends-in')} */}
                      Ends in
                    </DescriptionCardLabel>
                    <DescriptionCardContent>{`${endsIn.format(
                      "MMMM Do YYYY"
                    )} (${endsIn.fromNow()})`}</DescriptionCardContent>
                  </DescriptionCard>

                  <DescriptionCard>
                    <DescriptionCardLabel>
                      {/* {t('raffle-listings:buy-raffle-review-modal.amount-of-tickets')} */}
                      Amount of Tickets
                    </DescriptionCardLabel>
                    <DescriptionCardContent>
                      {/* {t('raffle-listings:buy-raffle-review-modal.tickets', {
												count: ticketNumber,
											})} */}
                      {ticketNumber} Tickets
                    </DescriptionCardContent>
                  </DescriptionCard>

                  <DescriptionCard>
                    <DescriptionCardLabel>
                      {/* {t('raffle-listings:buy-raffle-review-modal.ticket-cost')} */}
                      Ticket Cost
                    </DescriptionCardLabel>
                    <DescriptionCardContent>
                      {`${formaCurrency(
                        +(
                          raffle?.raffle_info?.raffle_ticket_price?.coin
                            ?.amount ??
                          // raffle?.raffle_info?.raffle_ticket_price?.cw20Coin?.amount ??
                          0
                        )
                      )} ${
                        DEFAULT_CURRENCY
                        // ?? raffle?.raffle_info?.raffle_ticket_price?.cw20Coin?.currency
                      }`}
                    </DescriptionCardContent>
                  </DescriptionCard>

                  <DescriptionCard>
                    <DescriptionCardLabel>
                      {/* {t('raffle-listings:buy-raffle-review-modal.total-cost')} */}
                      Total Cost
                    </DescriptionCardLabel>
                    <DescriptionCardContent>
                      {`${formaCurrency(
                        Number(
                          raffle?.raffle_info?.raffle_ticket_price?.coin
                            ?.amount ??
                            // raffle?.raffle_info?.raffle_ticket_price?.cw20Coin?.amount ??
                            0
                        ) * ticketNumber
                      ).toFixed(3)} ${
                        DEFAULT_CURRENCY
                        //?? raffle?.raffle_info?.raffle_ticket_price?.cw20Coin?.currency
                      }`}
                    </DescriptionCardContent>
                  </DescriptionCard>
                </Flex>
                <Flex>
                  <Button
                    variant="gradient"
                    fullWidth
                    onClick={() => {
                      modal.resolve();
                      modal.remove();
                    }}
                  >
                    {/* {t('raffle-listings:buy-raffle-review-modal.buy-ticket')} */}
                    Buy Raffle Ticket
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
export default BuyRaffleReviewModal;
