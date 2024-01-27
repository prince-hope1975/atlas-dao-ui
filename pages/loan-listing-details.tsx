import React from "react";
import moment from "moment";
import { Box, Flex } from "theme-ui";
// import { useTranslation } from 'next-i18next'
import NiceModal from "@ebay/nice-modal-react";
import { sample } from "lodash";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AttributeCard as UIAttributeCard,
  BlueWarning,
  Button,
  DescriptionCard,
  DescriptionCardItem,
  Loader,
} from "../components/ui";

// import { makeStaticPaths, makeStaticProps } from 'lib'

import {
  Row,
  AttributeCard,
  AttributeName,
  AttributeValue,
  AttributesCard,
  OwnerName,
  OwnerAvatarImg,
  ParticipantsTitle,
  LoanHeaderActionsRow,
  LoanListingsYouMightLike,
  LoanOffersTable,
} from "../components/loan-listing-details";

import {
  AvatarIcon,
  CalendarIcon,
  StarIcon,
  WalletIcon,
} from "../assets/icons/mixed";
import useHeaderActions from "../hooks/useHeaderActions";
import { NFT } from "../services/api/walletNFTsService";
import { LoansService, SupportedCollectionsService } from "../services/api";
import { asyncAction } from "../utils/js/asyncAction";

import useAddress from "../hooks/useAddress";
import {
  FavoriteLoanResponse,
  FavoriteLoansService,
} from "../services/api/favoriteLoansService";
import {
  FAVORITES_LOANS,
  LATEST_BLOCK,
  LOAN,
  LOAN_OFFERS,
  VERIFIED_COLLECTIONS,
} from "../constants/useQueryKeys";
import useNameService from "../hooks/useNameService";
import CreateLoanListing from "../components/shared/header-actions/create-loan-listing/CreateLoanListings";
import { LOAN_STATE } from "../services/api/loansService";
import { fromIPFSImageURLtoImageURL } from "../utils/blockchain/ipfs";
import { BLOCKS_PER_DAY, DEFAULT_CURRENCY } from "../constants/core";
import networkUtils, {
  CHAIN_NAMES,
  amountConverter,
  getNetworkName,
} from "../utils/blockchain/networkUtils";

import * as ROUTES from "../constants/routes";
import { LoansContract } from "../services/blockchain";
import FundLoanOfferModal, {
  FundLoanOfferModalResult,
} from "../components/loan-listing-details/modals/fund-loan-modal/FundLoanModal";
import { DescriptionRow, ImageRow } from "../components/shared/trade";
import {
  NFTPreviewImages,
  TxBroadcastingModal,
  ViewNFTsModal,
  ViewNFTsModalProps,
  ViewNFTsModalResult,
} from "../components/shared";
import { LayoutContainer, Page } from "../components/layout";
import { LinkButton } from "../components/link";
import { NFTLoansQueryClient } from "@/services/blockchain/contracts/loans/NFTLoans.client";
import { useChain } from "@cosmos-kit/react";
import { Sg721Token } from "@/types";
import { useToken } from "@/hooks/useTokens";
import { useCollectionInfo } from "@/hooks/useCollectionInfo";
import convertTimestampToDate from "@/lib/convertTimeStampToDate";
import { formaCurrency } from "@/lib/formatCurrency";

// const getStaticProps = makeStaticProps(['common', 'loan-listings'])
// const getStaticPaths = makeStaticPaths()

// export { getStaticPaths, getStaticProps }

export default function LoanListingDetails() {
  // const { t } = useTranslation(['common', 'loan-listings'])
  const { sign, getSigningCosmWasmClient, address, getCosmWasmClient } =
    useChain(CHAIN_NAMES[1]);
  const route = useRouter();

  const networkName = getNetworkName();

  const myAddress = useAddress();

  const queryClient = useQueryClient();

  const { loanId, borrower } = route.query ?? {};

  const updateFavoriteLoanState = (data: FavoriteLoanResponse) =>
    queryClient.setQueryData(
      [FAVORITES_LOANS, networkName, myAddress],
      (old: any) => [...old.filter((o) => o.id !== data.id), data]
    );

  const { mutate: addFavoriteLoan } = useMutation(
    FavoriteLoansService.addFavoriteLoan,
    {
      onSuccess: updateFavoriteLoanState,
    }
  );

  const { mutate: removeFavoriteLoan } = useMutation(
    FavoriteLoansService.removeFavoriteLoan,
    {
      onSuccess: updateFavoriteLoanState,
    }
  );

  const { data: verifiedCollections } = useQuery(
    [VERIFIED_COLLECTIONS, networkName],
    async () =>
      SupportedCollectionsService.getSupportedCollections(networkName),
    {
      retry: true,
    }
  );
  LoansContract;
  const getLoanClient = async () => {
    const coswasmClient = await getCosmWasmClient();
    const contractAddr = networkUtils.getContractAddress("loan");

    const loanClient = new NFTLoansQueryClient(coswasmClient, contractAddr);
    return loanClient;
  };
  const {
    data: loan,
    isLoading,
    refetch,
  } = useQuery(
    ["loan", LOAN, loanId, networkName],
    async () => {
      const client = await getLoanClient();
      const service = await client.collateralInfo({
        borrower: borrower as string,
        loanId: +(loanId as string),
      });
      return service;
    },
    {
      retry: true,
      refetchInterval: 60 * 1000,
    }
  );
  const { data: active_offer, isLoading: active_offer_loading } = useQuery(
    ["loan", LOAN, loanId, networkName, loan?.state],
    async () => {
      const client = await getLoanClient();
      const service = await client.offerInfo({
        globalOfferId: loan?.active_offer!,
      });
      return service;
    },
    {
      retry: true,
      refetchInterval: 60 * 1000,
    }
  );

  const { data: latestBlockHeight, error } = useQuery(
    [LATEST_BLOCK, networkName],
    async () => {
      const _client = await getCosmWasmClient();

      const block = await _client.getBlock();
      return block;
    },
    {
      retry: true,
      refetchInterval: 60 * 1000,
    }
  );

  const { data: favoriteLoans } = useQuery(
    [FAVORITES_LOANS, networkName, myAddress],
    async () =>
      FavoriteLoansService.getFavoriteLoans(
        { network: networkName },
        {
          users: [myAddress],
        }
      ),
    {
      enabled: !!myAddress,
      retry: true,
    }
  );

  const [ownerInfo] = useNameService(
    (borrower as string) ? [borrower as string] : []
  );

  const acceptedLoanOffer = active_offer ?? null;
  const { comment, ...loanInfo } = loan ?? {};

  const [loanPreview, setLoanPreview] = React.useState<{
    sg721_token?: Sg721Token;
  } | null>(null);

  React.useEffect(() => {
    if (loan) {
      setLoanPreview(loan?.loan_preview ?? null);
    }
  }, [loan]);

  useHeaderActions(<CreateLoanListing />);

  const handleViewAllNFTs = async () => {
    if (!loan) {
      return;
    }
    const [, result] = await asyncAction<ViewNFTsModalResult>(
      NiceModal.show(ViewNFTsModal, {
        nfts: [loan?.loan_preview?.sg721_token],
        title: "All NFTs", //  t('common:all-nfts'),
      } as ViewNFTsModalProps)
    );

    if (result) {
      setLoanPreview((oldPrev) => ({ ...oldPrev, sg721_token: result.nft }));
    }
  };

  const liked = false;
  //   Boolean(
  //     (favoriteLoans ?? []).find((favoriteLoan) =>
  //       favoriteLoan.loans.some((favLoan) => favLoan.id === Number(id))
  //     )
  //   );

  const fundLoan = async () => {
    if (!loan) {
      return;
    }

    const [, result] = await asyncAction<FundLoanOfferModalResult>(
      NiceModal.show(FundLoanOfferModal, {
        loan,
        borrower: borrower as string,
        id: loanId as string,
      })
    );

    if (result) {
      const fundLoanResponse = await NiceModal.show(TxBroadcastingModal, {
        transactionAction: LoansContract.fundLoan(
          {
            loanId: +(loanId as string),
            borrower: borrower as string,
            amountNative: loan?.terms?.principle?.amount,
            comment: result.comment,
            address: address!,
            client: getSigningCosmWasmClient,
          }
          //   +(loanId as string),
          //   borrower as string,
          //   loan?.terms?.principle?.amount,
          //   result.comment
        ),

        closeOnFinish: true,
      });

      if (fundLoanResponse) {
        await refetch();
        await queryClient.refetchQueries([LOAN_OFFERS]);
      }
    }
  };

  const repayLoan = async () => {
    if (!loan) {
      return;
    }

    if (!acceptedLoanOffer) {
      return;
    }
    const totalAmountToRepay = formaCurrency(
      (1 +
        formaCurrency(+acceptedLoanOffer?.offer_info?.terms?.interest! ?? 0) /
          100) *
        +(acceptedLoanOffer?.offer_info?.terms?.principle.amount ?? 0)
    );
    const repayLoanResponse = await NiceModal.show(TxBroadcastingModal, {
      transactionAction: LoansContract.repayBorrowedFunds(
        +(loanId as string),
        `${totalAmountToRepay}`,
        address!,
        getSigningCosmWasmClient
      ),
      closeOnFinish: true,
    });

    if (repayLoanResponse) {
      refetch();
    }
  };

  const withdrawDefaultedLoan = async () => {
    if (!loan) {
      return;
    }

    const withdrawDefaultedResponse = await NiceModal.show(
      TxBroadcastingModal,
      {
        transactionAction: LoansContract.withdrawDefaultedLoan(
          +(loanId as string),
          borrower as string,
          address!,
          getSigningCosmWasmClient
        ),
        closeOnFinish: true,
      }
    );

    if (withdrawDefaultedResponse) {
      refetch();
    }
  };

  const toggleLike = () =>
    ({ addFavoriteLoan, removeFavoriteLoan }[
      liked ? "removeFavoriteLoan" : "addFavoriteLoan"
    ]({
      network: networkName,
      loanId: [Number(loanId)],
      borrower: borrower as string,
      user: myAddress,
    }));

  const ownerName =
    ownerInfo?.extension?.publicName ?? ownerInfo?.extension?.name;

  const isMyLoan = borrower === myAddress;

  const { data } = useToken(
    loan?.associated_assets?.map((Res) => Res.sg721_token)!,
    [loan?.loan_preview?.sg721_token?.token_id]
  );
  const { data: collectionInfo } = useCollectionInfo(
    loan?.loan_preview?.sg721_token?.address!,
    [
      loan?.loan_preview?.sg721_token?.address,
      loan?.loan_preview?.sg721_token?.token_id,
    ]
  );

  console.log({
    loan: loan?.start_block,
    termsBlock: loan?.terms?.duration_in_blocks,
    latestBlockHeight: latestBlockHeight?.header?.height,
    list_date: loan?.list_date,
  });
  return (
    <Page
      title="Title" // {t('title')}
    >
      <LayoutContainer>
        {!isLoading ? (
          <>
            <LoanHeaderActionsRow
              loanId={loanId as string}
              borrower={borrower as string}
              loan={loan}
            />
            <Row>
              {![LOAN_STATE.Published].includes(loan?.state as LOAN_STATE) && (
                <BlueWarning sx={{ width: "100%", height: "49px" }}>
                  {/* {t('loan-listings:item-not-available')} */}
                  This item is no longer available
                </BlueWarning>
              )}
            </Row>

            <Flex
              sx={{
                flexDirection: ["column", "column", "row"],
                gap: [0, 0, "32px"],
              }}
            >
              <Box
                sx={{
                  flex: [1, 1, "unset"],
                  width: ["unset", "unset", "491px"],
                }}
              >
                <ImageRow
                  nft={[loan?.loan_preview?.sg721_token!]}
                  id={loan?.loan_preview?.sg721_token?.token_id! ?? []}
                  onLike={toggleLike}
                  liked={liked}
                />

                <Row>
                  <Button fullWidth variant="dark" onClick={handleViewAllNFTs}>
                    <Flex sx={{ alignItems: "center" }}>
                      <NFTPreviewImages
                        nfts={(loan?.associated_assets ?? [])
                          .filter((asset) => asset.sg721_token)
                          .map(({ sg721_token }) => sg721_token)}
                      />
                      <div>
                        {/* {t('loan-listings:view-all-nfts')} */}
                        View All NFTs
                      </div>
                    </Flex>
                  </Button>
                </Row>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Row>
                  <DescriptionRow
                    isPrivate={false}
                    name={data?.at(0)?.token?.name ?? ""}
                    collectionName={collectionInfo?.name ?? ""}
                    verified={(verifiedCollections ?? []).some(
                      ({ collectionAddress }) =>
                        loan?.loan_preview?.sg721_token?.address ===
                        collectionAddress
                    )}
                  />
                </Row>
                {/* {Boolean(
                  loan?.loan_preview?.sg721_token?.attributes?.length
                ) && (
                  <Row>
                    <Flex sx={{ flexWrap: "wrap", gap: "4.3px" }}>
                      {(loan?.loan_preview?.sg721_token?.attributes ?? []).map(
                        (attribute) => (
                          <UIAttributeCard
                            key={JSON.stringify(attribute)}
                            name={attribute.traitType}
                            value={attribute.value}
                          />
                        )
                      )}
                    </Flex>
                  </Row>
                )} */}
                <Row>
                  <DescriptionCard>
                    <DescriptionCardItem>
                      <Flex sx={{ alignItems: "center" }}>
                        <Box
                          sx={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          {ownerInfo?.extension?.image ? (
                            <OwnerAvatarImg
                              src={fromIPFSImageURLtoImageURL(
                                ownerInfo?.extension?.image
                              )}
                            />
                          ) : (
                            <AvatarIcon width="100%" height="100%" />
                          )}
                        </Box>
                        {ownerName && (
                          <Box sx={{ ml: "4px" }}>
                            <OwnerName>{ownerName}</OwnerName>
                          </Box>
                        )}
                        <Box sx={{ ml: "4px", flex: 1 }}>{`''${
                          comment ?? ""
                        }''`}</Box>
                      </Flex>
                    </DescriptionCardItem>
                    <DescriptionCardItem>
                      <WalletIcon width="20px" height="20px" color="#fff" />
                      <Box
                        sx={{
                          ml: "9px",
                          flex: 1,
                        }}
                      >
                        {borrower ?? ""}
                      </Box>
                    </DescriptionCardItem>
                    <DescriptionCardItem>
                      <CalendarIcon width="20px" height="20px" color="#fff" />
                      <Box
                        sx={{
                          ml: "9px",
                          flex: 1,
                        }}
                      >
                        {moment(
                          convertTimestampToDate(+(loan?.list_date ?? 0))
                        ).fromNow()}
                      </Box>
                    </DescriptionCardItem>
                  </DescriptionCard>
                </Row>

                <Row>
                  <AttributesCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('loan-listings:loan-period')} */}
                        Loan Period
                      </AttributeName>
                      <AttributeValue>
                        {/* {t('loan-listings:days', {
													count: Math.floor(
														(acceptedLoanOffer?.offerInfo?.terms?.durationInBlocks ??
															loanInfo?.terms?.durationInBlocks ??
															0) / BLOCKS_PER_DAY
													),
												})} */}
                        {Math.floor(
                          (loan?.terms?.duration_in_blocks ?? 0) /
                            BLOCKS_PER_DAY
                        )}
                      </AttributeValue>
                    </AttributeCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('loan-listings:blocks-until-default')} */}
                        Blocks Until Default
                      </AttributeName>
                      <AttributeValue>
                        {/* {loanInfo?.startBlock
													? t('loan-listings:blocks-estimated', {
															count:
																(loanInfo?.startBlock ?? 0) +
																(acceptedLoanOffer?.offerInfo?.terms?.durationInBlocks ?? 0) -
																(Number(latestBlockHeight) ?? 0),
													  })
													: '-'} */}
                        {loan?.start_block
                          ? (loan?.start_block ?? 0) +
                            (loan?.terms?.duration_in_blocks ?? 0) -
                            (Number(latestBlockHeight?.header?.height) || 0)
                          : "-"}
                      </AttributeValue>
                    </AttributeCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('loan-listings:days-until-default')} */}
                        Days Until Default
                      </AttributeName>
                      <AttributeValue>
                        {/* {loanInfo?.startBlock
													? t('loan-listings:days-estimated', {
															estimated: (
																((loanInfo?.startBlock ?? 0) +
																	(acceptedLoanOffer?.offerInfo?.terms?.durationInBlocks ?? 0) -
																	(Number(latestBlockHeight) ?? 0)) /
																BLOCKS_PER_DAY
															).toFixed(2),
													  })
													: '-'} */}

                        {loan?.start_block
                          ? (
                              ((Number(loan?.start_block!) ?? 0) +
                                (loan?.terms?.duration_in_blocks ?? 0) -
                                (Number(latestBlockHeight?.header?.height) ??
                                  0)) /
                              BLOCKS_PER_DAY
                            ).toFixed(2)
                          : "-"}
                      </AttributeValue>
                    </AttributeCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('loan-listings:loan-amount')} */}
                        Loan Amount
                      </AttributeName>
                      <AttributeValue>
                        {/* {t('loan-listings:loan-principle', {
													amount:
														acceptedLoanOffer?.offerInfo?.terms?.principle?.amount ??
														loanInfo?.terms?.principle?.amount,
													currency:
														acceptedLoanOffer?.offerInfo?.terms?.principle?.currency ??
														loanInfo?.terms?.principle?.currency,
												})} */}
                        {formaCurrency(+(loan?.terms?.principle?.amount ?? 0))}
                        {DEFAULT_CURRENCY ?? loan?.terms?.principle?.denom}
                        <Box sx={{ ml: 8 }}>
                          <StarIcon />
                        </Box>
                      </AttributeValue>
                    </AttributeCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('loan-listings:interest-rate-apr')} */}
                        Interest Rate (%)
                      </AttributeName>
                      <AttributeValue>
                        {/* {t('common:percentage', {
													value:
														acceptedLoanOffer?.offerInfo?.terms?.interestRate ??
														loanInfo?.terms?.interestRate ??
														0,
												})} */}
                        {Intl.NumberFormat("en-Us", {
                          maximumSignificantDigits: 3,
                        }).format(
                          Number(
                            (+(loan?.terms?.interest ?? 0) /
                              +(loan?.terms?.principle?.amount ?? 0)) *
                              100
                          )
                        )}
                      </AttributeValue>
                    </AttributeCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('loan-listings:repayment-amount')} */}
                        Repay Amount
                      </AttributeName>
                      <AttributeValue>
                        {/* {t('loan-listings:loan-repayment', {
													amount: amountConverter.default
														.blockchainValueToUserFacing(
															acceptedLoanOffer?.offerInfo?.terms?.totalAmountToRepay ??
																loanInfo?.terms?.totalAmountToRepay ??
																0
														)
														.toFixed(3),
													currency:
														acceptedLoanOffer?.offerInfo?.terms?.principle?.currency ??
														loanInfo?.terms?.principle?.currency ??
														'',
												})} */}

                        {/* {(
                          (1 +
                            formaCurrency(+(loan?.terms?.interest! ?? 0)) /
                              100) *
                          formaCurrency(+(loan?.terms?.principle?.amount ?? 0))
                        ).toFixed(3)} */}
                        {formaCurrency(
                          +(loan?.terms?.interest! ?? 0) +
                            +(loan?.terms?.principle?.amount ?? 0)
                        )}
                        {DEFAULT_CURRENCY ?? ""}
                        <Box sx={{ ml: 8 }}>
                          <StarIcon />
                        </Box>
                      </AttributeValue>
                    </AttributeCard>
                  </AttributesCard>
                </Row>
              
                {isMyLoan &&
                  acceptedLoanOffer &&
                  [LOAN_STATE.Started].includes(
                    loan?.state ?? ("" as LOAN_STATE)
                  ) && (
                    <Row>
                      <Button
                        size="extraLarge"
                        fullWidth
                        variant="gradient"
                        onClick={repayLoan}
                      >
                        <div>
                          {/* {t('loan-listings:repay-loan')} */}
                          Repay Loan
                        </div>
                      </Button>
                    </Row>
                  )}

                {!isMyLoan &&
                  [LOAN_STATE.PendingDefault].includes(
                    loan?.state as LOAN_STATE
                  ) &&
                  active_offer?.offer_info?.lender === myAddress && (
                    <Row>
                      <Button
                        size="extraLarge"
                        fullWidth
                        variant="gradient"
                        onClick={withdrawDefaultedLoan}
                      >
                        <div>
                          {/* {t('loan-listings:withdraw')} */}
                          Withdraw Defaulted
                        </div>
                      </Button>
                    </Row>
                  )}

                {!isMyLoan &&
                  [LOAN_STATE.Published].includes(
                    loan?.state ?? ("" as LOAN_STATE)
                  ) && (
                    <Row
                      sx={{
                        gap: ["8px"],
                        flexDirection: ["column", "column", "row"],
                      }}
                    >
                      <Button
                        size="extraLarge"
                        fullWidth
                        variant="gradient"
                        onClick={fundLoan}
                      >
                        <div>
                          {/* {t('loan-listings:fund-loan')} */}
                          Fund Loan
                        </div>
                      </Button>
                      <LinkButton
                        href={`${ROUTES.LOAN_OFFER}?loanId=${loanId}&borrower=${borrower}`}
                        size="extraLarge"
                        fullWidth
                        variant="dark"
                      >
                        <div>
                          {/* {t('loan-listings:make-offer')} */}
                          Make Offer
                        </div>
                      </LinkButton>
                    </Row>
                  )}
              </Box>
            </Flex>

            <Row>
              <Flex sx={{ flex: 1, flexDirection: "column" }}>
                <Box sx={{ padding: "8px 0" }}>
                  <ParticipantsTitle>
                    {/* {t('loan-listings:loan-offers.title')} */}
                    Loan Offers
                  </ParticipantsTitle>
                </Box>
                <LoanOffersTable
                  refetchLoan={refetch}
                  loan={loan}
                  loanId={loanId as string}
                  borrower={borrower as string}
                />
              </Flex>
            </Row>
            {/* Loan listing */}
            {/* <LoanListingsYouMightLike
              search={
                data?.[0]?.token?.name ??
                sample(verifiedCollections ?? [])?.collectionName ??
                ""
              }
              loanId={loanId as string}
              borrower={borrower as string}
              loan={loan!}
            /> */}
          </>
        ) : (
          <Flex
            sx={{
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader />
          </Flex>
        )}
      </LayoutContainer>
    </Page>
  );
}
