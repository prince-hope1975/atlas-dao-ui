import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useTranslation } from 'next-i18next'
import NiceModal from "@ebay/nice-modal-react";

import {
  Button,
  Card,
  DescriptionCard,
  DescriptionCardItem,
  Loader,
  AttributeCard as PrimaryAttributeCard,
} from "../components/ui";

// import { makeStaticPaths, makeStaticProps } from 'lib'
import { Box, Flex } from "theme-ui";
import moment from "moment";

import {
  HorizontalLoanLine,
  Row,
  VerticalLoanLine,
} from "../components/loan-listing-details";

import {
  ArrowLeftIcon,
  AvatarIcon,
  CalendarIcon,
  WalletIcon,
} from "../assets/icons/mixed";
import useHeaderActions from "../hooks/useHeaderActions";
import * as ROUTES from "../constants/routes";
import { NFT } from "../services/api/walletNFTsService";
import { LoanOffersService, LoansService } from "../services/api";
import { asyncAction } from "../utils/js/asyncAction";

import {
  ViewNFTsModalProps,
  ViewNFTsModalResult,
  ViewNFTsModal,
  TxBroadcastingModal,
  ModalTitle,
} from "../components/shared";

import NFTPreviewImages from "../components/shared/nft-preview-images/NFTPreviewImages";
import { FAVORITES_LOANS, LOAN } from "../constants/useQueryKeys";
import { FormProvider, useForm } from "react-hook-form";

import useAddress from "../hooks/useAddress";
import { theme } from "../constants/theme";
import { FavoriteLoansService } from "../services/api/favoriteLoansService";
import { Coin, NetworkName, Sg721Token } from "../types";
import CreateLoanListing from "../components/shared/header-actions/create-loan-listing/CreateLoanListings";
import { LoanOfferForm } from "../types/loan/types";
import Offer from "../components/loan-offer/Offer";
import { LoanDetailsStepSchema } from "../constants/validation-schemas/loan";
import { LoansContract } from "../services/blockchain";
import SubmitLoanOfferModal, {
  SubmitLoanOfferModalProps,
} from "../components/loan-offer/modals/submit-loan-offer-modal/SubmitLoanOfferModal";
import { SubmitLoanOfferSuccessModal } from "../components/loan-offer/modals";
import { ImageRow } from "../components/shared/trade";
import { LayoutContainer, Page } from "../components/layout";
import { LinkButton } from "../components/link";
import networkUtils, {
  CHAIN_NAMES,
  getNetworkName,
} from "../utils/blockchain/networkUtils";
import { useChain } from "@cosmos-kit/react";
import { NFTLoansQueryClient } from "@/services/blockchain/contracts/loans/NFTLoans.client";
import { DEFAULT_CURRENCY } from "@/constants/core";

// const getStaticProps = makeStaticProps(['common', 'loan-listings', 'loan'])
// const getStaticPaths = makeStaticPaths()

// export { getStaticPaths, getStaticProps }

export default function LoanCounter() {
  // const { t } = useTranslation(['common', 'loan-listings'])

  const route = useRouter();

  const networkName = getNetworkName();

  const { loanId, borrower } = route.query ?? {};

  const myAddress = useAddress();

  const queryClient = useQueryClient();

  const { sign, getSigningCosmWasmClient, address, getCosmWasmClient } =
    useChain(CHAIN_NAMES[1]);
  const updateFavoriteLoanState = (data: any) =>
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

  const { data: loan, isLoading } = useQuery({
    queryKey: [LOAN, loanId, networkName],
    queryFn: async () => {
      console.log("Over and over again");
      const client = await getCosmWasmClient();
      const contractAddr = networkUtils.getContractAddress("loan");
      const queryClient = new NFTLoansQueryClient(client, contractAddr!);
      const value = await queryClient.collateralInfo({
        loanId: +(loanId as string),
        borrower: borrower as string,
      });
      return value;
    },
    //   retry: true,
  });

  const { data: favoriteLoans } = useQuery(
    [FAVORITES_LOANS, networkName, myAddress],
    async () =>
      FavoriteLoansService.getFavoriteLoans(
        { network: networkName as NetworkName },
        {
          users: [myAddress],
        }
      ),
    {
      enabled: !!myAddress,
      retry: true,
    }
  );

  const loanInfo = loan;

  const [loanPreview, setLoanPreview] = React.useState<{
    coin?: Coin;
    cw721Coin?: NFT;
    sg721_token?: Sg721Token;
  } | null>(null);

  React.useEffect(() => {
    if (loan) {
      console.log("setting");
      setLoanPreview(loan?.loan_preview);
    }
  }, [loan?.terms?.duration_in_blocks]);

  useHeaderActions(<CreateLoanListing />);

  const formMethods = useForm<LoanOfferForm>({
    mode: "all",
    resolver: yupResolver(LoanDetailsStepSchema),

    defaultValues: {
      tokenName: DEFAULT_CURRENCY,
    },
  });

  const handleViewAllNFTs = async () => {
    if (!loan) {
      return;
    }
    const [, result] = await asyncAction<ViewNFTsModalResult>(
      NiceModal.show(ViewNFTsModal, {
        nfts: (loan?.associated_assets ?? [])
          .filter(({ sg721_token }) => sg721_token)
          .map(({ sg721_token }) => sg721_token),
        title: "all nfts",
        // title: t("common:all-nfts"),
      } as ViewNFTsModalProps)
    );

    if (result) {
      setLoanPreview((oldPrev) => ({ ...oldPrev, sg721_token: result.nft }));
    }
  };

  const onSubmit = async ({
    tokenAmount,
    tokenName,
    interestRate,
    loanPeriod,
    comment,
  }: {
    tokenAmount: string;
    tokenName: string;
    interestRate: string;
    loanPeriod: string;
    comment: string;
  }) => {
    if (!loanId) {
      return;
    }
    const client = await getCosmWasmClient();
    const contractAddr = networkUtils.getContractAddress("loan");
    const queryClient = new NFTLoansQueryClient(client, contractAddr!);

    await NiceModal.show(SubmitLoanOfferModal, {
      loan: loan!,
      tokenAmount,
      tokenName,
      interestRate,
      loanPeriod,
      comment,
      borrower,
      loanId,
    } as SubmitLoanOfferModalProps);

    const loanOfferResult: {
      globalOfferId: string;
    } = await NiceModal.show(TxBroadcastingModal, {
      transactionAction: LoansContract.makeLoanOffer({
        loanId: loanId as string,
        borrower: borrower as string,
        durationInDays: loanPeriod,
        interestRate,
        amountNative: tokenAmount,
        comment,
        address: address!,
        client: getSigningCosmWasmClient,
      }),
      closeOnFinish: true,
    });

    formMethods.reset();
	console.log({ result: loanOfferResult?.globalOfferId });
    await Promise.all([
      NiceModal.show(SubmitLoanOfferSuccessModal, {
        loan: loan!,
        borrower: borrower! as string,
        loanId: loanId! as string,
      }),
      queryClient.offerInfo({
        globalOfferId: loanOfferResult.globalOfferId,
      }),
      //   LoanOffersService.getLoanOffer(
      //     networkName,
      //     loanOfferResult.globalOfferId
      //   ),
    ]);
  };

  const liked = Boolean(
    (favoriteLoans ?? []).find((favoriteLoan) =>
      favoriteLoan.loans.some(
        (favLoan) => favLoan.id == +((loanId as string) ?? 0)
      )
    )
  );

  const toggleLike = () =>
    ({ addFavoriteLoan, removeFavoriteLoan }[
      liked ? "removeFavoriteLoan" : "addFavoriteLoan"
    ]({
      network: networkName,
      loanId: [`${loanId}`],
      borrower: `${borrower}`,
      user: myAddress,
    }));

  return (
    <Page
      title="Title"
      // {t('title')}
    >
      <LayoutContainer>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Flex
              sx={{ flexDirection: "column", mb: "48px", overflow: "auto" }}
            >
              {!isLoading ? (
                <>
                  <Flex
                    sx={{
                      justifyContent: "flex-start",
                      padding: "22px 0",
                    }}
                  >
                    <LinkButton
                      href={`${ROUTES.LOAN_LISTING_DETAILS}?loanId=${loanId}&borrower=${borrower}`}
                      sx={{ height: "40px", padding: "13px" }}
                      variant="secondary"
                      startIcon={<ArrowLeftIcon />}
                    >
                      {/* {t('loan-listings:back-to-listing')} */}
                      Back to Listing
                    </LinkButton>
                  </Flex>
                  <Row>
                    <ModalTitle>
                      {/* {t('loan-listings:loan-counter.title')} */}
                      Make Offer
                    </ModalTitle>
                  </Row>
                  <Flex sx={{ flexDirection: ["column", "column", "row"] }}>
                    <Flex
                      sx={{
                        flex: 1,
                        order: [1, 1, 3],
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Offer />
                      </Box>
                    </Flex>
                    <Box
                      sx={{
                        order: 2,
                        my: 10,
                        width: "100%",
                        display: ["block", "block", "none"],
                      }}
                    >
                      <HorizontalLoanLine />
                    </Box>

                    <Box
                      sx={{
                        order: 2,
                        minHeight: "100%",
                        display: ["none", "none", "block"],
                      }}
                    >
                      <VerticalLoanLine />
                    </Box>

                    <Card
                      sx={{
                        flex: 1,
                        order: [3, 3, 1],
                        flexDirection: "column",
                        p: "12px",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <ImageRow
                          nft={[loan?.loan_preview?.sg721_token!]}
                          id={(loanId as string) ?? []}
                          onLike={toggleLike}
                          liked={liked}
                        />

                        <Row>
                          <Button
                            fullWidth
                            variant="dark"
                            onClick={handleViewAllNFTs}
                          >
                            <Flex sx={{ alignItems: "center" }}>
                              <NFTPreviewImages
                                nfts={(loanInfo?.associated_assets ?? [])
                                  .filter((asset) => asset.sg721_token)
                                  .map(({ sg721_token }) => sg721_token)}
                              />
                              <div>
                                {/* {t('loan-listings:view-all-nfts')} */}
                                View All Listings
                              </div>
                            </Flex>
                          </Button>
                        </Row>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        {Boolean(
                          loanPreview?.cw721Coin?.attributes?.length
                        ) && (
                          <Row>
                            <Flex sx={{ flexWrap: "wrap", gap: "4.3px" }}>
                              {(loanPreview?.cw721Coin?.attributes ?? []).map(
                                (attribute) => (
                                  <PrimaryAttributeCard
                                    key={JSON.stringify(attribute)}
                                    name={attribute.traitType}
                                    value={attribute.value}
                                  />
                                )
                              )}
                            </Flex>
                          </Row>
                        )}
                        <Row>
                          <DescriptionCard>
                            <DescriptionCardItem
                              style={{ background: theme.colors.dark400 }}
                            >
                              <Flex sx={{ alignItems: "center" }}>
                                <AvatarIcon />
                                <Box sx={{ ml: "3px", flex: 1 }}>
                                  {`''${loanInfo?.comment ?? ""}''`}
                                </Box>
                              </Flex>
                            </DescriptionCardItem>
                            <DescriptionCardItem
                              style={{ background: theme.colors.dark400 }}
                            >
                              <WalletIcon
                                width="20px"
                                height="20px"
                                color={theme.colors.gray1000}
                              />
                              <Box
                                sx={{
                                  ml: "9px",
                                  flex: 1,
                                }}
                              >
                                {borrower ?? ""}
                              </Box>
                            </DescriptionCardItem>
                            <DescriptionCardItem
                              style={{ background: theme.colors.dark400 }}
                            >
                              <CalendarIcon
                                width="20px"
                                height="20px"
                                color={theme.colors.gray1000}
                              />
                              <Box
                                sx={{
                                  ml: "9px",
                                  flex: 1,
                                }}
                              >
                                {/* {t(`loan-listings:listed`, {
																	listed: moment(loanInfo?.listDate ?? '').fromNow(),
																})} */}
                                Listed{" "}
                                {moment(loanInfo?.list_date ?? "").fromNow()}
                              </Box>
                            </DescriptionCardItem>
                          </DescriptionCard>
                        </Row>
                      </Box>
                    </Card>
                  </Flex>
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
            </Flex>
          </form>
        </FormProvider>
      </LayoutContainer>
    </Page>
  );
}
