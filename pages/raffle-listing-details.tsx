import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useTranslation } from 'next-i18next'
import NiceModal from "@ebay/nice-modal-react";
import { Box, Flex } from "theme-ui";
import moment from "moment";

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
  RaffleHeaderActionsRow,
  RaffleParticipantsTable,
  RaffleListingsYouMightLike,
  AttributeCard,
  AttributeName,
  AttributeValue,
  AttributesCard,
  OwnerName,
  OwnerAvatarImg,
  ParticipantsTitle,
  AttributeDescription,
} from "../components/raffle-listing-details";

import {
  AvatarIcon,
  CalendarIcon,
  StarIcon,
  WalletIcon,
} from "../assets/icons/mixed";
import useHeaderActions from "../hooks/useHeaderActions";
import { NFT } from "../services/api/walletNFTsService";
import { isNaN, sample } from "lodash";
import { SupportedCollectionsService } from "../services/api";
import { asyncAction } from "../utils/js/asyncAction";

import useAddress from "../hooks/useAddress";
import NFTPreviewImages from "../components/shared/nft-preview-images/NFTPreviewImages";
import {
  FAVORITES_RAFFLES,
  RAFFLE,
  VERIFIED_COLLECTIONS,
} from "../constants/useQueryKeys";
import {
  FavoriteRaffleResponse,
  FavoriteRafflesService,
} from "../services/api/favoriteRafflesService";
import {
  RafflesService,
  RAFFLE_STATE,
  RafflesResponse,
} from "../services/api/rafflesService";
import CreateRaffleListing from "../components/shared/header-actions/create-raffle-listing/CreateRaffleListing";
import { RafflesContract } from "../services/blockchain";
import BuyTicketModal, {
  BuyTicketModalResult,
} from "../components/raffle-listing-details/modals/buy-ticket-modal/BuyTicketModal";
import useNameService from "../hooks/useNameService";
import { fromIPFSImageURLtoImageURL } from "../utils/blockchain/ipfs";
import BuyRaffleReviewModal from "../components/raffle-listing-details/modals/buy-raffle-review-modal/BuyRaffleReviewModal";
import {
  TxBroadcastingModal,
  ViewNFTsModal,
  ViewNFTsModalProps,
  ViewNFTsModalResult,
} from "../components/shared";
import { DescriptionRow, ImageRow } from "../components/shared/trade";
import { LayoutContainer, Page } from "../components/layout";
import networkUtils, {
  CHAIN_NAMES,
  getNetworkName,
} from "../utils/blockchain/networkUtils";
import { useChain } from "@cosmos-kit/react";
import { RaffleClient } from "@/services/blockchain/contracts/raffles/Raffle.client";
import convertTimestampToDate from "@/lib/convertTimeStampToDate";
import { Coin, coin, parseCoins } from "@cosmjs/amino";
import { formaCurrency } from "@/lib/formatCurrency";
import {
  RaffleResponse,
  Sg721Token,
} from "@/services/blockchain/contracts/raffles/Raffle.types";

// const getStaticProps = makeStaticProps(['common', 'raffle-listings'])
// const getStaticPaths = makeStaticPaths()

// export { getStaticPaths, getStaticProps }

export default function ListingDetails() {
  // const { t } = useTranslation(['common', 'raffle-listings'])
  const { sign, getSigningCosmWasmClient, address, getCosmWasmClient } =
    useChain(CHAIN_NAMES[1]);
  const Raffle_comp = useCallback(async () => {
    const client = await getSigningCosmWasmClient();
    const contractAddr = networkUtils.getContractAddress("raffle");
    return new RaffleClient(client, address!, contractAddr);
  }, [address]);
  const route = useRouter();

  const networkName = getNetworkName();

  const myAddress = useAddress();

  const queryClient = useQueryClient();

  const { raffleId, randomnessProvider } = route.query ?? {};

  const updateFavoriteRaffleState = (data: FavoriteRaffleResponse) =>
    queryClient.setQueryData(
      [FAVORITES_RAFFLES, networkName, myAddress],
      (old: any) => [...old.filter((o) => o?.id !== data?.id), data]
    );

  const { mutate: addFavoriteRaffle } = useMutation(
    FavoriteRafflesService.addFavoriteRaffle,
    {
      onSuccess: updateFavoriteRaffleState,
    }
  );

  const { mutate: removeFavoriteRaffle } = useMutation(
    FavoriteRafflesService.removeFavoriteRaffle,
    {
      onSuccess: updateFavoriteRaffleState,
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
  const {
    data: raffle,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: [RAFFLE, raffleId, networkName],
    queryFn: async () => {
      if (!address || !raffleId) return null;
      const raffle_client = await Raffle_comp();
      const raf = await raffle_client.raffleInfo({ raffleId: +raffleId });
      console.log({ raf });
      return raf;
    },
    retry: true,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
  const { coin } =
    (raffle?.raffle_info?.raffle_ticket_price as { coin: Coin }) ?? {};
  const price = formaCurrency(+coin?.amount ?? 0);
  const { data: favoriteRaffles } = useQuery(
    [FAVORITES_RAFFLES, networkName, myAddress],
    async () =>
      FavoriteRafflesService.getFavoriteRaffles(
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
    raffle?.data?.owner ? [raffle?.raffleInfo?.owner] : []
  );

  const { raffle_info } = raffle ?? {};
  const { raffle_options } = raffle_info ?? {};

  const [rafflePreview, setRafflePreview] = React.useState<
    | {
        sg721_token?: Sg721Token;
      }[]
    | null
  >(null);

  React.useEffect(() => {
    if (raffle) {
      const vals = Object.values(raffle?.raffle_info?.assets!)?.filter(
        (res) => res?.sg721_token
      )??[]
      setRafflePreview(vals!);
    }
  }, [raffle]);

  useHeaderActions(<CreateRaffleListing />);

  const handleViewAllNFTs = async () => {
    if (!raffle) {
      return;
    }
    const [, result] = await asyncAction<ViewNFTsModalResult>(
      NiceModal.show(ViewNFTsModal, {
        nfts: (
          (raffle?.raffle_info?.assets as { sg721_token: Sg721Token }[]) ?? []
        )
          .filter(({ sg721_token }) => sg721_token)
          .map(({ sg721_token }) => sg721_token),
        title: "All NFTs", //  t('common:all-nfts'),
      } as ViewNFTsModalProps)
    );

    if (result) {
      setRafflePreview((oldPrev) => ({ ...oldPrev, cw721Coin: result.nft }));
    }
  };

  const isMyRaffle = raffle_info?.owner === myAddress;

  const liked = Boolean(
    (favoriteRaffles ?? []).find((favoriteRaffle) =>
      favoriteRaffle.raffles.some(
        (fRaffle) => fRaffle.raffleId === Number(raffleId)
      )
    )
  );

  const toggleLike = () =>
    ({ addFavoriteRaffle, removeFavoriteRaffle }[
      liked ? "removeFavoriteRaffle" : "addFavoriteRaffle"
    ]({
      network: networkName,
      raffleId: [Number(raffleId)],
      user: myAddress,
    }));

  const purchaseTicket = async () => {
    if (!raffle || !raffle_info) {
      return;
    }

    const [, result] = await asyncAction<BuyTicketModalResult>(
      NiceModal.show(BuyTicketModal)
    );

    if (result) {
      await NiceModal.show(BuyRaffleReviewModal, {
        raffle,
        ticketNumber: +result.ticketNumber,
      });

      await NiceModal.show(TxBroadcastingModal, {
        transactionAction: RafflesContract.purchaseRaffleTickets(
          raffle?.raffle_id,
          +result.ticketNumber,
          coin.amount
          // cw20Coin
        ),
        closeOnFinish: true,
      });

      await refetch();
    }
  };

  const drawTicket = async () => {
    if (!raffle) {
      return;
    }

    await NiceModal.show(TxBroadcastingModal, {
      transactionAction: RafflesContract.drawRaffle(raffle?.raffle_id),
      closeOnFinish: true,
    });

    refetch();
  };

  // const provideRandomness = async () => {
  // 	if (!raffle) {
  // 		return
  // 	}

  // 	const randomness = await DrandService.getRandomness()

  // 	await NiceModal.show(TxBroadcastingModal, {
  // 		transactionAction: RafflesContract.provideRandomness(
  // 			raffle?.raffleId,
  // 			randomness
  // 		),
  // 		closeOnFinish: true,
  // 	})
  // }

  const ticketsSold = 0;

  const ticketsRemaining =
    (raffle_options?.max_participant_number ?? 0) - ticketsSold;

  const ticketPrice = Number(
    price ??
      // raffleInfo?.raffleTicketPrice?.cw20Coin?.amount ??
      0
  );

  const ticketCurrency =
    "stars" ??
    // raffleInfo?.raffleTicketPrice?.cw20Coin?.currency ??
    "";

  const myWinningOdds =
    (((raffle?.participants ?? []).find((p) => p.user === myAddress)
      ?.ticketNumber ?? 0) /
      +ticketsSold) *
    100;

  const ownerName = raffle?.raffle_info?.owner;

  const raffleEndDate = moment(
    convertTimestampToDate(
      +raffle_info?.raffle_options?.raffle_start_timestamp!
    )
  ).add(raffle_info?.raffle_options?.raffle_duration ?? 0, "seconds");
  return (
    <Page
      title="Title" //{t('title')}
    >
      <LayoutContainer>
        {!isLoading ? (
          <>
            <RaffleHeaderActionsRow raffle={raffle!} />
            <Row>
              {![RAFFLE_STATE.Started, RAFFLE_STATE.Created].includes(
                raffle?.raffle_state as RAFFLE_STATE
              ) && (
                <BlueWarning sx={{ width: "100%", height: "49px" }}>
                  {/* {t('raffle-listings:item-not-available')} */}
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
                  nft={rafflePreview?.map(res=>res?.sg721_token!).filter(res=>res)!??[]}
                  id={raffle?.raffle_id!}
                  onLike={toggleLike}
                  liked={liked}
                />

                <Row>
                  <Button fullWidth variant="dark" onClick={handleViewAllNFTs}>
                    <Flex sx={{ alignItems: "center" }}>
                      <NFTPreviewImages
                        nfts={(raffle?.raffle_info?.assets ?? [])
                          .filter((asset) => asset?.sg721_token)
                          .map(({ sg721_token }) => sg721_token as Sg721Token)}
                      />
                      <div>
                        {/* {t('raffle-listings:view-all-nfts')} */}
                        View all NFTs
                      </div>
                    </Flex>
                  </Button>
                </Row>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Row>
                  <DescriptionRow
                    isPrivate={false}
                    name={rafflePreview?.cw721Coin?.name}
                    collectionName={
                      rafflePreview?.cw721Coin?.collectionName ?? ""
                    }
                    verified={(verifiedCollections ?? []).some(
                      ({ collectionAddress }) =>
                        rafflePreview?.cw721Coin?.collectionAddress ===
                        collectionAddress
                    )}
                  />
                </Row>
                {Boolean(rafflePreview?.cw721Coin?.attributes?.length) && (
                  <Row>
                    <Flex sx={{ flexWrap: "wrap", gap: "4.3px" }}>
                      {(rafflePreview?.cw721Coin?.attributes ?? []).map(
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
                )}
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
                        <Box sx={{ ml: "4px", flex: 1 }}>
                          {`''${raffle_options?.comment ?? ""}''`}
                        </Box>
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
                        {raffle_info?.owner ?? ""}
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
                        {/* {t(`raffle-listings:listed`, {
													listed: moment(
														raffleInfo?.raffleOptions?.raffleStartDate ?? ''
													).fromNow(),
												})} */}
                        {moment(
                          convertTimestampToDate(
                            raffle_info?.raffle_options?.raffle_start_timestamp!
                          ) ?? ""
                        ).fromNow()}
                      </Box>
                    </DescriptionCardItem>
                  </DescriptionCard>
                </Row>

                <Row>
                  <AttributesCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('raffle-listings:raffle-start-date')} */}
                        Raffle Start Date
                      </AttributeName>
                      <AttributeValue>
                        {moment(
                          convertTimestampToDate(
                            +raffle_info?.raffle_options
                              ?.raffle_start_timestamp!
                          ) ?? ""
                        ).format("L LT")}
                      </AttributeValue>
                      <AttributeDescription>
                        {moment(
                          convertTimestampToDate(
                            +raffle_info?.raffle_options
                              ?.raffle_start_timestamp!
                          ) ?? ""
                        ).fromNow()}
                      </AttributeDescription>
                    </AttributeCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t(`raffle-listings:raffle-end-date`)} */}
                        Raffle End Date
                      </AttributeName>
                      <AttributeValue>
                        {" "}
                        {raffleEndDate.format("L LT")}
                      </AttributeValue>

                      <AttributeDescription>
                        {raffleEndDate.fromNow()}
                      </AttributeDescription>
                    </AttributeCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('raffle-listings:raffle-ticket-cost')} */}
                        Ticket Cost
                      </AttributeName>
                      <AttributeValue>
                        {ticketPrice} {ticketCurrency}
                        <Box sx={{ ml: 8 }}>
                          <StarIcon />
                        </Box>
                      </AttributeValue>
                    </AttributeCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('raffle-listings:raffle-tickets-remaining')} */}
                        Tickets Remaining
                      </AttributeName>
                      <AttributeValue>
                        {ticketsRemaining}
                        {raffle_options?.maxParticipantNumber
                          ? ` / ${raffle_options?.maxParticipantNumber}`
                          : ""}
                      </AttributeValue>
                    </AttributeCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('raffle-listings:total-volume')} */}
                        Volume
                      </AttributeName>
                      <AttributeValue>
                        {`${Number(ticketPrice * ticketsSold).toFixed(
                          2
                        )} ${ticketCurrency}`}
                      </AttributeValue>
                    </AttributeCard>
                    <AttributeCard>
                      <AttributeName>
                        {/* {t('raffle-listings:winning-odds')} */}
                        Winning Odds
                      </AttributeName>
                      <AttributeValue>
                        {`${(isNaN(myWinningOdds) ? 0 : myWinningOdds).toFixed(
                          2
                        )} %`}
                      </AttributeValue>
                    </AttributeCard>
                  </AttributesCard>
                </Row>

                {!isMyRaffle &&
                  raffle &&
                  (raffle?.participants ?? [])
                    .map((p) => p.ticketNumber)
                    .reduce((a, b) => a + b, 0) <
                    (raffle_options?.maxParticipantNumber ??
                      Number.POSITIVE_INFINITY) &&
                  [RAFFLE_STATE.Started].includes(
                    raffle_info?.state as RAFFLE_STATE
                  ) && (
                    <Row>
                      <Button
                        size="extraLarge"
                        onClick={purchaseTicket}
                        fullWidth
                        variant="gradient"
                      >
                        <div>
                          {/* {t('raffle-listings:buy-raffle-ticket')} */}
                          Buy Raffle Ticket
                        </div>
                      </Button>
                    </Row>
                  )}

                {raffle &&
                  [RAFFLE_STATE.Finished].includes(
                    raffle_info?.state as RAFFLE_STATE
                  ) &&
                  !raffle_info?.winner && (
                    <Row>
                      <Button
                        size="extraLarge"
                        onClick={drawTicket}
                        fullWidth
                        variant="gradient"
                      >
                        <div>
                          {/* {t('raffle-listings:draw-raffle-ticket')} */}
                          Draw Raffle Ticket
                        </div>
                      </Button>
                    </Row>
                  )}

                {raffle &&
                  randomnessProvider &&
                  [RAFFLE_STATE.Closed].includes(
                    raffle_info?.state as RAFFLE_STATE
                  ) && (
                    <Row>
                      <Button
                        size="extraLarge"
                        // onClick={provideRandomness}
                        fullWidth
                        variant="gradient"
                      >
                        <div>
                          {/* {t('raffle-listings:provide-randomness')} */}
                          Provide Randomness
                        </div>
                      </Button>
                    </Row>
                  )}
              </Box>
            </Flex>

            <Row>
              <Flex sx={{ flex: 1, flexDirection: "column" }}>
                <Box sx={{ padding: "8px 0" }}>
                  <ParticipantsTitle>
                    {/* {t('raffle-listings:participants.title')} */}
                    Participants
                  </ParticipantsTitle>
                </Box>
                <RaffleParticipantsTable raffle={raffle} />
              </Flex>
            </Row>
            <RaffleListingsYouMightLike
              search={
                rafflePreview?.cw721Coin?.collectionName ??
                sample(verifiedCollections ?? [])?.collectionName ??
                ""
              }
              raffleId={raffle?.raffleId}
            />
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
