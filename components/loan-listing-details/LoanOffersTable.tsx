import styled from "@emotion/styled";

import {
  Table,
  TableHead,
  TableHeadRow,
  TableHeadRowCell,
  TableBody,
  TableBodyRow,
  TableBodyRowCell,
  OverflowTip,
  Button,
} from "@/components/ui";
// import { useTranslation } from 'next-i18next'
import React from "react";

import { Box, Flex } from "theme-ui";
import NiceModal from "@ebay/nice-modal-react";
import { AvatarIcon, StarIcon } from "@/assets/icons/mixed";
import moment from "moment";
import { Loan, LOAN_STATE } from "@/services/api/loansService";
import { LOAN_OFFERS } from "@/constants/useQueryKeys";
import { useQuery } from "@tanstack/react-query";
import { isNil } from "lodash";
import {
  LoanOffer,
  LoanOffersService,
  OFFER_STATE,
} from "@/services/api/loansOffersService";
import useAddress from "@/hooks/useAddress";
import { TxBroadcastingModal } from "@/components/shared";
import { LoansContract } from "../../services/blockchain";
import { BLOCKS_PER_DAY, DEFAULT_CURRENCY } from "@/constants/core";
import useNameService from "@/hooks/useNameService";
import { fromIPFSImageURLtoImageURL } from "@/utils/blockchain/ipfs";
import networkUtils, {
  CHAIN_NAMES,
  getNetworkName,
} from "@/utils/blockchain/networkUtils";
import {
  NameLabel,
  NameServiceImage,
  NameServiceImagePlaceholder,
  TokenChip,
} from "./styled";
import { Collateral, Offer } from "@/types/loan/types";
import { useChain } from "@cosmos-kit/react";
import { NFTLoansQueryClient } from "@/services/blockchain/contracts/loans/NFTLoans.client";
import convertTimestampToDate from "@/lib/convertTimeStampToDate";
import { formaCurrency } from "@/lib/formatCurrency";

const Container = styled(Flex)`
  flex-direction: column;
  padding-bottom: 45px;
  width: 100%;
`;
interface LoanOffersTableProps {
  loan?: Collateral["collateral"];
  loanId?: string;
  borrower?: string;
  excludeTopBorder?: boolean;
  refetchLoan: () => void;
}
function LoanOffersTable({
  loan,
  excludeTopBorder,
  refetchLoan,
  loanId,
  borrower,
}: LoanOffersTableProps) {
  // const { t } = useTranslation(['common', 'loan-listings'])
  const networkName = getNetworkName();
  const myAddress = useAddress();

  // const columns: Array<string> = t('loan-listings:loan-offers.table.columns', {
  // 	returnObjects: true,
  // })
  const columns: Array<string> = [];

  const [page, setPage] = React.useState(1);

  // TODO extract this into hook, along with useQuery part.
  const [infiniteData, setInfiniteData] = React.useState<Offer[]>([]);
  const { sign, getSigningCosmWasmClient, address, getCosmWasmClient } =
    useChain(CHAIN_NAMES[1]);
  const getLoanClient = async () => {
    const coswasmClient = await getCosmWasmClient();
    const contractAddr = networkUtils.getContractAddress("loan");

    const loanClient = new NFTLoansQueryClient(coswasmClient, contractAddr);
    return loanClient;
  };
  React.useEffect(() => {
    setInfiniteData([]);
    setPage(1);
  }, [networkName, loanId, borrower]);

  const {
    data: loanOffers,
    isLoading,
    error,
  } = useQuery(
    [LOAN_OFFERS, networkName, page, borrower, loanId],
    async () => {
      const loanClient = await getLoanClient();
      return await loanClient.offers({
        loanId: +(loanId! ?? 0),
        limit: 20,
        borrower: borrower!,
      });
    },

    {
      enabled: !isNil(loanId) && !isNil(borrower),
      retry: true,
    }
  );
  React.useEffect(
    () => loanOffers && setInfiniteData((prev) => [...loanOffers.offers]),
    [...(loanOffers?.offers ?? [])?.map((res) => res.offer_info?.state)]
  );

  const updateLoanOffer = async (offer: Offer) => {
    refetchLoan();

    const updatedOffer = await LoanOffersService.getLoanOffer(
      networkName,
      offer.global_offer_id
    );

    // setInfiniteData(
    //   infiniteData?.map((loanOffer) =>
    //     loanOffer.offer_info?.offer_id === updatedOffer.id ? updatedOffer : loanOffer
    //   )
    // );
  };

  const withdrawOffer = async (offer: Offer) => {
    await NiceModal.show(TxBroadcastingModal, {
      transactionAction: LoansContract.withdrawRefusedOffer(
        offer?.global_offer_id,
        address!,
        getSigningCosmWasmClient
      ),
      closeOnFinish: true,
    });

    await updateLoanOffer(offer);
  };

  const handleApprove = async (offer: Offer) => {
    await NiceModal.show(TxBroadcastingModal, {
      transactionAction: LoansContract.acceptOffer(
        offer?.global_offer_id,
        address!,
        getSigningCosmWasmClient
      ),
      closeOnFinish: true,
    });

    await updateLoanOffer(offer);
  };

  const handleDeny = async (offer: Offer) => {
    await NiceModal.show(TxBroadcastingModal, {
      transactionAction: LoansContract.refuseOffer(
        offer?.global_offer_id,
        address!,
        getSigningCosmWasmClient
      ),
      closeOnFinish: true,
    });

    await updateLoanOffer(offer);
  };

  const cancelOffer = async (offer: Offer) => {
    await NiceModal.show(TxBroadcastingModal, {
      transactionAction: LoansContract.cancelOffer(
        offer?.global_offer_id,
        address!,
        getSigningCosmWasmClient
      ),
      closeOnFinish: true,
    });

    await updateLoanOffer(offer);
  };

  const nameServiceResolutions = useNameService(
    infiniteData.map((o) => o?.offer_info?.lender ?? "")
  );

  const isMyLoan = borrower === myAddress;

  return (
    <Container>
      <Table
        style={
          excludeTopBorder
            ? { borderTopRightRadius: 0, borderTopLeftRadius: 0 }
            : {}
        }
      >
        <TableHead>
          <TableHeadRow>
            {(columns || []).map((col, idx) => (
              <TableHeadRowCell key={col + idx}>{col}</TableHeadRowCell>
            ))}
            <TableHeadRowCell />
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {(infiniteData ?? []).map((offer, index) => {
            const isMyOffer = offer?.offer_info?.lender === myAddress;

            const profileImage =
              nameServiceResolutions[index]?.extension?.image;
            const name = nameServiceResolutions[index]?.extension?.name ?? "";

            return (
              <TableBodyRow key={offer.offer_info?.offer_id!}>
                <TableBodyRowCell style={{ verticalAlign: "top" }}>
                  <Flex sx={{ gap: "12px", flex: 1 }}>
                    <NameServiceImagePlaceholder>
                      {profileImage ? (
                        <NameServiceImage
                          src={fromIPFSImageURLtoImageURL(profileImage)}
                        />
                      ) : (
                        <AvatarIcon width="100%" height="100%" />
                      )}
                    </NameServiceImagePlaceholder>
                    <div>
                      <OverflowTip>
                        <NameLabel>{name}</NameLabel>
                      </OverflowTip>
                      <OverflowTip>
                        <div>{offer?.offer_info?.lender ?? ""}</div>
                      </OverflowTip>
                      <OverflowTip>
                        <div>{`''${offer?.offer_info?.comment ?? ""}''`}</div>
                      </OverflowTip>
                    </div>
                  </Flex>
                </TableBodyRowCell>
                <TableBodyRowCell>
                  <Flex
                    sx={{
                      justifyContent: "flex-start",
                      minWidth: "160px",
                    }}
                  >
                    <TokenChip>
                      <Box sx={{ flex: 1, justifyContent: "center" }}>
                        {offer?.offer_info?.terms?.principle?.amount ? (
                          <Flex>
                            <Flex sx={{ mr: "2px", alignItems: "center" }}>
                              {`${formaCurrency(
                                +(
                                  offer?.offer_info?.terms?.principle?.amount ??
                                  0
                                )
                              )} ${DEFAULT_CURRENCY}`}
                            </Flex>
                            <StarIcon />
                          </Flex>
                        ) : (
                          <div>-</div>
                        )}
                      </Box>
                    </TokenChip>
                  </Flex>
                </TableBodyRowCell>
                <TableBodyRowCell>
                  <Flex sx={{ minWidth: "40px" }}>
                    {/* {t('common:percentage', {
											value: offer?.offerInfo?.terms?.interestRate,
										})} */}
                    {formaCurrency(+(offer?.offer_info?.terms?.interest ?? 0))}
                  </Flex>
                </TableBodyRowCell>
                <TableBodyRowCell>
                  <Flex sx={{ minWidth: "80px" }}>
                    {/* {t('loan-listings:days', {
											count: Math.floor(
												offer?.offerInfo?.terms?.durationInBlocks / BLOCKS_PER_DAY
											),
										})} */}
                    {Math.floor(
                      offer?.offer_info?.terms?.duration_in_blocks /
                        BLOCKS_PER_DAY
                    )}
                  </Flex>
                </TableBodyRowCell>

                <TableBodyRowCell>
                  <Flex sx={{ minWidth: "60px" }}>
                    {offer?.offer_info?.state}
                  </Flex>
                </TableBodyRowCell>
                <TableBodyRowCell>
                  <Flex
                    sx={{
                      justifyContent: "flex-start",
                      minWidth: "90px",
                    }}
                  >
                    {moment(
                      convertTimestampToDate(+offer?.offer_info?.list_date!)
                    ).fromNow()}
                  </Flex>
                </TableBodyRowCell>
                <TableBodyRowCell>
                  {/* 
											When loan is not mine, loan is any state, my offer is refused (not accepted) or cancelled I can
											* Withdraw my assets from offer.
										*/}
                  {!isMyLoan &&
                    isMyOffer &&
                    [OFFER_STATE.Refused].includes(
                      offer?.offer_info?.state as OFFER_STATE
                    ) &&
                    offer?.offer_info?.deposited_funds && (
                      <Button onClick={async () => withdrawOffer(offer)}>
                        {/* {t('common:withdraw')} */}
                        Withdraw
                      </Button>
                    )}

                  {/* When loan is published and I am the borrower and offer is
										published. 
											* I can refuse/deny loan offer.
											* I can accept/approve loan offer.
										*/}

                  {isMyLoan &&
                    [LOAN_STATE.Published].includes(
                      loan?.state as LOAN_STATE
                    ) &&
                    !isMyOffer &&
                    [OFFER_STATE.Published].includes(
                      offer?.offer_info.state as OFFER_STATE
                    ) && (
                      <Flex sx={{ gap: "8px" }}>
                        <Button
                          variant="primary"
                          onClick={() => handleApprove(offer)}
                        >
                          {/* {t('loan-listings:loan-offers.table.approve')} */}
                          Approve
                        </Button>

                        <Button
                          onClick={() => handleDeny(offer)}
                          variant="secondary"
                        >
                          {/* {t('loan-listings:loan-offers.table.deny')} */}
                          Deny
                        </Button>
                      </Flex>
                    )}

                  {/* {
										I can cancel offer if in published state and It's not my loan
										I's my offer
									} */}
                  {!isMyLoan &&
                    isMyOffer &&
                    [OFFER_STATE.Published].includes(
                      offer?.offer_info?.state as OFFER_STATE
                    ) && (
                      <Button onClick={async () => cancelOffer(offer)}>
                        {/* {t('common:remove')} */}
                        Remove
                      </Button>
                    )}
                </TableBodyRowCell>
              </TableBodyRow>
            );
          })}
        </TableBody>
      </Table>
      <Flex sx={{ mt: "12px" }}>
        {loanOffers && !!loanOffers.offers?.length && !isLoading && (
          <Button
            // disabled={loanOffers?.page === loanOffers.pageCount}
            fullWidth
            variant="dark"
            onClick={() => setPage((prev) => prev + 1)}
          >
            {/* {t('common:show-more')} */}
            Show More
          </Button>
        )}
      </Flex>
    </Container>
  );
}

LoanOffersTable.defaultProps = {
  loan: undefined,
  excludeTopBorder: false,
};

export default LoanOffersTable;
