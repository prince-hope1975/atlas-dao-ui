import { Loader } from "@/components/ui";
// import { useTranslation } from 'next-i18next'
import React from "react";
import { SupportedCollectionGetResponse } from "@/services/api/supportedCollectionsService";
import { NFT } from "@/services/api/walletNFTsService";
import { Box, Flex } from "theme-ui";
import * as ROUTES from "@/constants/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import useAddress from "@/hooks/useAddress";
import { FAVORITES_RAFFLES } from "@/constants/useQueryKeys";
import { Raffle } from "@/services/api/rafflesService";
import {
  FavoriteRaffleResponse,
  FavoriteRafflesService,
} from "@/services/api/favoriteRafflesService";
import moment from "moment";
import { getNetworkName } from "@/utils/blockchain/networkUtils";
import {
  AssetInfo,
  Coin,
  RaffleResponse,
  Sg721Token,
} from "@/services/blockchain/contracts/raffles/Raffle.types";
import { StargazeListingCard } from "./listing-card/ListingCard";
import { Cw721Coin } from "@/types";
import convertTimestampToDate from "@/lib/convertTimeStampToDate";

export enum GRID_TYPE {
  SMALL = 0,
  BIG = 1,
}

interface OLD_GridControllerProps {
  raffles: Raffle[];
  gridType?: GRID_TYPE;
  verifiedCollections?: SupportedCollectionGetResponse[];
  isLoading?: boolean;
  favoriteRaffles?: FavoriteRaffleResponse[];
}
interface GridControllerProps {
  raffles: RaffleResponse[];
  gridType?: GRID_TYPE;
  verifiedCollections?: SupportedCollectionGetResponse[];
  isLoading?: boolean;
  favoriteRaffles?: FavoriteRaffleResponse[];
}

const stylesByGrid = {
  [GRID_TYPE.SMALL]: {
    gridTemplateColumns: [
      "1fr",
      "repeat(auto-fill, minmax(332px, 1fr))",
      "repeat(auto-fill, minmax(245px, 1fr))",
    ],
    gridColumnGap: ["16px", "25px", "14px"],
    gridRowGap: ["8px", "16px", "18px"],
  },
  [GRID_TYPE.BIG]: {
    gridTemplateColumns: [
      "1fr",
      "repeat(auto-fill, minmax(332px, 1fr))",
      "repeat(auto-fill, minmax(225px, 1fr))",
    ],
    gridColumnGap: ["16px", "25px", "14px"],
    gridRowGap: ["8px", "16px", "18px"],
  },
};
function GridController({
  raffles,
  gridType = GRID_TYPE.SMALL,
  verifiedCollections = [],
  isLoading,
  favoriteRaffles,
}: GridControllerProps) {
  // 	const { t } = useTranslation()

  const networkName = getNetworkName();

  const myAddress = useAddress();

  const queryClient = useQueryClient();

  const updateFavoriteRaffleState = (data: FavoriteRaffleResponse) =>
    queryClient.setQueryData(
      [FAVORITES_RAFFLES, networkName, myAddress],
      (old: any) => [...old?.filter((o) => o.id !== data.id), data]
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

  if (isLoading) {
    return (
      <Flex
        sx={{
          marginTop: "240px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader
          loadingText="Loading"
          // {t('common:loading')}
        />
      </Flex>
    );
  }

  return (
    <Flex
      sx={{
        display: "grid",
        width: [null, null, "100%"],
        overflow: "auto",
        ...stylesByGrid[gridType],
      }}
    >
      {raffles?.map(
        ({
          //   id,
          raffle_id,
          raffle_state,
          raffle_info,
        }) => {
          const {
            assets,
            is_cancelled,
            number_of_tickets,
            owner,
            raffle_options,
            raffle_ticket_price,
            randomness,
            winner: _winner,
          } = raffle_info!;
          const liked = Boolean(
            (favoriteRaffles ?? []).find((favoriteRaffle) =>
              favoriteRaffle.raffles.some((raffle) => raffle.id === id)
            )
          );
          const price = raffle_ticket_price as { coin: Coin };

          const toggleLike = () =>
            ({ addFavoriteRaffle, removeFavoriteRaffle }[
              liked ? "removeFavoriteRaffle" : "addFavoriteRaffle"
            ]({
              network: networkName,
              raffleId: [Number(raffle_id)],
              user: myAddress,
            }));

          const ticketsSold = number_of_tickets;

          const ticketPrice = Number(
            price?.coin?.amount ??
              // raffleTicketPrice?.cw20Coin?.amount ??
              0
          );

          const ticketCurrency =
            price?.coin?.demon as string ??
            // raffleTicketPrice?.cw20Coin?.currency ??
            "";

          const totalVolume = ticketPrice * ticketsSold;

          const ticketsRemaining =
            (raffle_options?.max_participant_number ?? 0) - ticketsSold;
          const collectionAddr = assets?.flatMap((val) =>
            Object.values(val)
              .map((res) => res?.address)
              .filter((ewa) => !!ewa)
          );

          return (
            <Box key={raffle_id}>
              <StargazeListingCard
                state={raffle_state}
                winner={_winner!}
                onLike={toggleLike}
                description={raffle_options?.comment ?? ""}
                // attributes={raffle_options?.cw721Coin?.attributes ?? []}
                tokenId={`${raffle_id}` ?? ""}
                collectionAddress={collectionAddr?.[0] ?? ""}
                href={`${ROUTES.RAFFLE_LISTING_DETAILS}?raffleId=${raffle_id}`}
                nfts={(assets || [])
                  .filter((nft) => nft?.sg721_token)
                  .map(({ sg721_token }) => sg721_token as Sg721Token)}
                imageUrl={assets?.sg721_token?.imageUrl ?? []}
                name={assets?.sg721_token?.name ?? ""}
                liked={liked}
                verified={verifiedCollections.some(
                  ({ collectionAddress }) =>
                    raffle_options?.rafflePreview?.cw721Coin
                      ?.collectionAddress === collectionAddress
                )}
                collectionName={
                  raffle_options?.rafflePreview?.cw721Coin?.collectionName || ""
                }
                ticketPrice={ticketPrice}
                ticketCurrency={ticketCurrency}
                ticketNumber={raffle_options?.max_participant_number!}
                totalVolume={totalVolume}
                ticketsRemaining={ticketsRemaining}
                endsIn={moment(convertTimestampToDate(+raffle_options?.raffle_start_timestamp))
                  .add(raffle_options?.raffle_duration ?? 0, "seconds")
                  .toDate()}
                isSmall={gridType === GRID_TYPE.BIG}
              />
            </Box>
          );
        }
      )}
    </Flex>
  );
}
function OLD_GridController({
  raffles,
  gridType = GRID_TYPE.SMALL,
  verifiedCollections = [],
  isLoading,
  favoriteRaffles,
}: OLD_GridControllerProps) {
  // 	const { t } = useTranslation()

  const networkName = getNetworkName();

  const myAddress = useAddress();

  const queryClient = useQueryClient();

  const updateFavoriteRaffleState = (data: FavoriteRaffleResponse) =>
    queryClient.setQueryData(
      [FAVORITES_RAFFLES, networkName, myAddress],
      (old: any) => [...old.filter((o) => o.id !== data.id), data]
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

  if (isLoading) {
    return (
      <Flex
        sx={{
          marginTop: "240px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader
          loadingText="Loading"
          // {t('common:loading')}
        />
      </Flex>
    );
  }

  return (
    <Flex
      sx={{
        display: "grid",
        width: [null, null, "100%"],
        overflow: "auto",
        ...stylesByGrid[gridType],
      }}
    >
      {raffles.map(
        ({
          id,
          raffleId,
          participants,
          raffleInfo: {
            raffleTicketPrice,
            raffleOptions,
            allAssociatedAssets,
            winner,
            state,
          },
        }) => {
          const liked = Boolean(
            (favoriteRaffles ?? []).find((favoriteRaffle) =>
              favoriteRaffle.raffles.some((raffle) => raffle.id === id)
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

          const ticketsSold = (participants ?? []).reduce(
            (a, b) => a + b.ticketNumber,
            0
          );

          const ticketPrice = Number(
            raffleTicketPrice?.coin?.amount ??
              // raffleTicketPrice?.cw20Coin?.amount ??
              0
          );

          const ticketCurrency =
            raffleTicketPrice?.coin?.currency ??
            // raffleTicketPrice?.cw20Coin?.currency ??
            "";

          const totalVolume = ticketPrice * ticketsSold;

          const ticketsRemaining =
            (raffleOptions?.maxParticipantNumber ?? 0) - ticketsSold;

          return (
            <Box key={raffleId}>
              <StargazeListingCard
                state={state}
                winner={winner}
                onLike={toggleLike}
                description={
                  raffleOptions?.rafflePreview?.cw721Coin?.description ?? ""
                }
                attributes={
                  raffleOptions?.rafflePreview?.cw721Coin?.attributes ?? []
                }
                tokenId={raffleOptions?.rafflePreview?.cw721Coin?.tokenId ?? ""}
                collectionAddress={
                  raffleOptions?.rafflePreview?.cw721Coin?.collectionAddress ??
                  ""
                }
                href={`${ROUTES.RAFFLE_LISTING_DETAILS}?raffleId=${raffleId}`}
                nfts={(allAssociatedAssets || [])
                  .filter((nft) => nft.cw721Coin)
                  .map(({ cw721Coin }) => cw721Coin as NFT)}
                imageUrl={
                  raffleOptions?.rafflePreview?.cw721Coin?.imageUrl ?? []
                }
                name={raffleOptions?.rafflePreview?.cw721Coin?.name ?? ""}
                liked={liked}
                verified={verifiedCollections.some(
                  ({ collectionAddress }) =>
                    raffleOptions?.rafflePreview?.cw721Coin
                      ?.collectionAddress === collectionAddress
                )}
                collectionName={
                  raffleOptions?.rafflePreview?.cw721Coin?.collectionName || ""
                }
                ticketPrice={ticketPrice}
                ticketCurrency={ticketCurrency}
                ticketNumber={raffleOptions.maxParticipantNumber}
                totalVolume={totalVolume}
                ticketsRemaining={ticketsRemaining}
                endsIn={moment(raffleOptions?.raffleStartDate)
                  .add(raffleOptions?.raffleDuration ?? 0, "seconds")
                  .toDate()}
                isSmall={gridType === GRID_TYPE.BIG}
              />
            </Box>
          );
        }
      )}
    </Flex>
  );
}

GridController.defaultProps = {
  gridType: GRID_TYPE.SMALL,
  verifiedCollections: [],
  isLoading: false,
  favoriteRaffles: [],
};

export default GridController;
