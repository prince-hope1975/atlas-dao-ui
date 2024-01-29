import { Loader } from "@/components/ui";
// import { useTranslation } from 'next-i18next'
import React from "react";
import { SupportedCollectionGetResponse } from "@/services/api/supportedCollectionsService";
import { Box, Flex } from "theme-ui";
import * as ROUTES from "@/constants/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useAddress from "@/hooks/useAddress";

import {
  FavoriteLoanResponse,
  FavoriteLoansService,
} from "@/services/api/favoriteLoansService";
import { Loan } from "@/services/api/loansService";
import { FAVORITES_LOANS, LATEST_BLOCK } from "@/constants/useQueryKeys";
import { NFT } from "@/services/api/walletNFTsService";
import { BLOCKS_PER_DAY } from "@/constants/core";
import networkUtils, { getNetworkName } from "@/utils/blockchain/networkUtils";
import { calculateRangePercentage } from "@/utils/js/calculateRangePercentage";
import { ListingCard } from "./listing-card";
import { Collateral } from "@/types/loan/types";
import { useToken } from "@/hooks/useTokens";
import { formaCurrency } from "@/lib/formatCurrency";

export enum GRID_TYPE {
  SMALL = 0,
  BIG = 1,
}

interface GridControllerProps {
  loans: Collateral[];
  gridType?: GRID_TYPE;
  verifiedCollections?: SupportedCollectionGetResponse[];
  isLoading?: boolean;
  favoriteLoans?: FavoriteLoanResponse[];
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
  loans,
  gridType = GRID_TYPE.SMALL,
  verifiedCollections = [],
  isLoading,
  favoriteLoans,
}: GridControllerProps) {
  // 	const { t } = useTranslation()

  const networkName = getNetworkName();

  const myAddress = useAddress();

  const queryClient = useQueryClient();

  const { data: latestBlockHeight } = useQuery(
    [LATEST_BLOCK, networkName],
    async () => networkUtils.getLatestBlockHeight(),
    {
      retry: true,
      refetchInterval: 60 * 1000,
    }
  );

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
          loadingText={
            // t('common:loading')
            "loading"
          }
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
      {loans?.map((props, key) => {
        return (
          <LoanItem
            key={key}
            {...props}
            favoriteLoans={favoriteLoans}
            verifiedCollections={verifiedCollections}
            gridType={gridType}
          />
        );
      })}
    </Flex>
  );
}
const LoanItem = ({
  loan_id: id,
  borrower,
  collateral: {
    terms,
    loan_preview: loanPreview,
    associated_assets: associatedAssets,
    active_offer: activeOffer,
    state,
    start_block: startBlock,
    comment,
    list_date,
    offer_amount,
  },
  favoriteLoans,
  verifiedCollections,
  gridType,
}: Collateral & {
  favoriteLoans: FavoriteLoanResponse[] | undefined;
  verifiedCollections: SupportedCollectionGetResponse[];
  gridType?: GRID_TYPE;
}) => {
  const networkName = getNetworkName();
  const queryClient = useQueryClient();

  const myAddress = useAddress();
  const { data: latestBlockHeight } = useQuery(
    [LATEST_BLOCK, networkName],
    async () => networkUtils.getLatestBlockHeight(),
    {
      retry: true,
      refetchInterval: 60 * 1000,
    }
  );

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
  const loanId = id;
  const defaultBlock = (startBlock ?? 0) + (terms?.duration_in_blocks ?? 0);

  const liked = Boolean(
    (favoriteLoans ?? []).find((favoriteLoan) =>
      favoriteLoan.loans.some((loan) => loan.id === id)
    )
  );

  const toggleLike = () =>
    ({ addFavoriteLoan, removeFavoriteLoan }[
      liked ? "removeFavoriteLoan" : "addFavoriteLoan"
    ]({
      network: networkName,
      loanId: [Number(loanId)],
      borrower,
      user: myAddress,
    }));
  const { data } = useToken(
    [loanPreview?.sg721_token],
    [loanPreview?.sg721_token?.token_id,list_date]
  );
  // console.log({ loanId, data });
  return (
    <Box key={`${loanId}_${list_date}`}>
      <ListingCard
        onLike={toggleLike}
        state={state}
        description={data?.[0]?.token?.description ?? "random"}
        imageUrl={data?.[0]?.token?.imageUrl ?? ""}
        // attributes={loanPreview?.sg721_token?.attributes ?? []}
        tokenId={loanPreview?.sg721_token?.token_id ?? ""}
        collectionAddress={loanPreview?.sg721_token?.address ?? ""}
        href={`${ROUTES.LOAN_LISTING_DETAILS}?loanId=${loanId}&borrower=${borrower}`}
        nfts={(associatedAssets || [])
          .filter((nft) => nft.sg721_token)
          .map(({ sg721_token }) => sg721_token)}
        id={data?.[0]?.token?.id ?? loanId}
        name={data?.[0]?.token?.name ?? ""}
        liked={liked}
        apr={Intl.NumberFormat("en-Us", { maximumSignificantDigits: 3 }).format(
          Number(
            (+(terms?.interest ?? 0) / +(terms?.principle?.amount ?? 0)) * 100
          )
        )}
        borrowAmount={formaCurrency(Number(terms?.principle?.amount ?? 0))}
        defaultPercentage={
          startBlock
            ? calculateRangePercentage(
                Number(latestBlockHeight) ?? 0,
                startBlock ?? 0,
                defaultBlock ?? 0
              )
            : 0
        }
        defaultThreshold={90}
        timeFrame={Math.floor(
          Number((terms?.duration_in_blocks ?? 0) / BLOCKS_PER_DAY)
        )}
        verified={verifiedCollections.some(
          ({ collectionAddress }) =>
            loanPreview?.sg721_token?.address === collectionAddress
        )}
        collectionName={data?.at(0)?.token?.name || ""}
        isSmall={gridType === GRID_TYPE.BIG}
      />
    </Box>
  );
};
GridController.defaultProps = {
  gridType: GRID_TYPE.SMALL,
  verifiedCollections: [],
  isLoading: false,
  favoriteLoans: [],
};

export default GridController;
