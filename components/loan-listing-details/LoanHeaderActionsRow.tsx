import React from "react";
// import { useTranslation } from 'next-i18next'
import NiceModal from "@ebay/nice-modal-react";
import { Box, Flex } from "theme-ui";
import { useQueryClient } from "@tanstack/react-query";

import { IconButton } from "../trade-listing-details";
// import { TwitterShareButton } from 'react-share'
import {
  DeleteOutlineIcon,
  PenOutlineIcon,
  ShareOutlineIcon,
  ArrowLeftIcon,
} from "@/assets/icons/mixed";

import { useRouter } from "next/router";
import useAddress from "@/hooks/useAddress";
import { Loan, LOAN_STATE } from "@/services/api/loansService";
import { asyncAction } from "@/utils/js/asyncAction";
import { TxBroadcastingModal } from "@/components/shared";
import { LoansContract } from "@/services/blockchain";
import { LOAN } from "@/constants/useQueryKeys";
import { BLOCKS_PER_DAY, DEFAULT_CURRENCY } from "@/constants/core";
import { Button } from "@/components/ui";
import * as ROUTES from "@/constants/routes";
import {
  EditModal,
  RemoveModal,
  RemoveModalProps,
  RemoveSuccessModal,
} from "./modals";
import { EditModalProps, EditModalResult } from "./modals/edit-modal/EditModal";
import { Collateral } from "@/types/loan/types";
import { formaCurrency } from "@/lib/formatCurrency";
import { useChain } from "@cosmos-kit/react";
import { CHAIN_NAMES } from "@/utils/blockchain/networkUtils";

interface LoanHeaderActionsRowProps {
  loan?: Collateral["collateral"];
  borrower: string;
  loanId: string;
}

export const LoanHeaderActionsRow = ({
  loan,
  borrower,
  loanId,
}: LoanHeaderActionsRowProps) => {
  const { state } = loan ?? {};
  const { sign, getSigningCosmWasmClient, address, getCosmWasmClient } =
    useChain(CHAIN_NAMES[1]);
  const router = useRouter();

  const queryClient = useQueryClient();

  const editDisabled = ![LOAN_STATE.Published].includes(state as LOAN_STATE);

  const removeDisabled = ![LOAN_STATE.Published].includes(state as LOAN_STATE);

  const handleRemoveClick = async () => {
    if (!loan) {
      return;
    }
    const [, result] = await asyncAction<RemoveModalProps>(
      NiceModal.show(RemoveModal, {
        loanId: loanId,
      })
    );

    if (result) {
      const cancelLoanResponse = await NiceModal.show(TxBroadcastingModal, {
        transactionAction: LoansContract.cancelLoanListing(
          loanId,
          address!,
          getSigningCosmWasmClient
        ),
        closeOnFinish: true,
      });

      if (cancelLoanResponse) {
        await queryClient.invalidateQueries([LOAN]);

        NiceModal.show(RemoveSuccessModal);
      }
    }
  };

  const handleEditClick = async () => {
    if (!loan) {
      return;
    }

    const initialTokenName = DEFAULT_CURRENCY;
    const initialInterestRate = String(
      formaCurrency(+(loan?.terms?.interest ?? 0))
    );
    const initialTokenAmount = String(
      formaCurrency(+(loan?.terms?.principle?.amount ?? 0))
    );
    const initialLoanPeriod = String(
      loan?.terms?.duration_in_blocks / BLOCKS_PER_DAY
    );

    const initialComment = loan?.comment ?? "";

    const [, result] = await asyncAction<EditModalResult>(
      NiceModal.show(EditModal, {
        initialTokenName,
        initialInterestRate,
        initialTokenAmount,
        initialLoanPeriod,
        initialComment,
      } as EditModalProps)
    );

    if (result) {
      const { loanPeriod, interestRate, tokenAmount, comment } = result;
      const modifyRaffleResponse = await NiceModal.show(TxBroadcastingModal, {
        transactionAction: LoansContract.modifyLoanListing({
          loanId,
          durationInDays: loanPeriod,
          interestRate,
          amountNative: tokenAmount,
          comment,
          address: address!,
          client: getSigningCosmWasmClient,
        }),
        closeOnFinish: true,
      });

      if (modifyRaffleResponse) {
        await queryClient.invalidateQueries([LOAN]);
      }
    }
  };

  const myAddress = useAddress();

  const isMyLoanListing = borrower === myAddress;

  // const { t } = useTranslation(['common', 'loan-listings'])

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  return (
    <Flex
      sx={{
        mt: ["12.5px", "24px", "22px"],
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <Flex
        sx={{
          justifyContent: "flex-start",
        }}
      >
        <Button
          onClick={() => router.push(ROUTES.LOAN_LISTINGS)}
          sx={{ height: "40px", padding: "13px" }}
          variant="secondary"
          startIcon={<ArrowLeftIcon />}
        >
          {/* {t('loan-listings:back-to-listings')} */}
          Back to Listings
        </Button>
      </Flex>
      {isMyLoanListing && (
        <Flex
          sx={{
            gap: "6px",
            justifyContent: "flex-end",
          }}
        >
          <IconButton disabled={editDisabled} onClick={handleEditClick}>
            <PenOutlineIcon />
            <Box sx={{ ml: 9, display: ["none", "none", "block"] }}>
              {/* {t('common:edit')} */}
              Edit
            </Box>
          </IconButton>
          <IconButton disabled={removeDisabled} onClick={handleRemoveClick}>
            <DeleteOutlineIcon />
            <Box sx={{ ml: 9, display: ["none", "none", "block"] }}>
              {/* {t('common:remove')} */}
              Remove
            </Box>
          </IconButton>
          {/* <TwitterShareButton
						title={t('common:checkout-my-loan')}
						url={`${origin}${router.asPath}`}
					>
						<IconButton onClick={noop}>
							<ShareOutlineIcon />
							<Box sx={{ ml: 9, display: ['none', 'none', 'block'] }}>
								{t('common:share')}
							</Box>
						</IconButton>
					</TwitterShareButton> */}
        </Flex>
      )}
    </Flex>
  );
};

LoanHeaderActionsRow.defaultProps = {
  loan: undefined,
};

export default LoanHeaderActionsRow;
