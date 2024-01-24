import { useModal } from "@ebay/nice-modal-react";
import { useQuery } from "@tanstack/react-query";
import { useQuery as USE_QUERY, gql } from "@apollo/client";
import { NFTS_SORT_VALUE } from "../components/shared/modals/my-nfts-modal/MyNFTsModal.model";
import {
  PARTIAL_WALLET_NFTS,
} from "../constants/useQueryKeys";
import React from "react";
import {
  WalletNFTsService,
  WALLET_NFT_STATE,
} from "../services/api/walletNFTsService";
import { asyncAction } from "../utils/js/asyncAction";

import { getNetworkName } from "../utils/blockchain/networkUtils";
import useAddress from "./useAddress";
import { GET_TOKENS } from "@/config/documents";
import {
  ApiResponse,
  COLLECTION_DATA,
  WALLET_DATA,
} from "@/services/api/gqlWalletSercice";
import { Collection, stargazeIndexerClient } from "@/services/graphql";

export type UseMyNFTsFilters = {
  collectionAddresses: string[];
  name: string;
  sort: NFTS_SORT_VALUE;
};

// TODO: this hook would have to be refactored, until we find better solution on backend for fetching wallet NFTs.
export function useMyNFTs(filters: UseMyNFTsFilters) {
  const myAddress = useAddress();
  const networkName = getNetworkName();
  const modal = useModal();

  const {
    data: partialData,
    isLoading: partiallyLoading,
    refetch: refetchPartial,
  } = useQuery([PARTIAL_WALLET_NFTS, myAddress, modal.visible], async () => {
    const [error, data] = await asyncAction(
      WalletNFTsService.requestUpdateNFTs(networkName, myAddress)
    );
    GET_TOKENS;

    if (error) {
      return WalletNFTsService.requestNFTs(networkName, myAddress);
    }

    return data;
  });
  //   TODO: update this code to be dynamic and take in params
  const walletQueryData = USE_QUERY<ApiResponse>(WALLET_DATA, {
    variables: {
      ownerAddr: myAddress!,
      limit: 100,
      sortBy: "ACQUIRED_ASC",
    },
  });
  const collectionQueries = useQuery({
    queryFn: async () => {
      if (!walletQueryData?.data?.tokens?.total) return null;
      const tokCollectionAddr = walletQueryData?.data?.tokens?.tokens?.map(
        (res) => res?.collectionAddr
      );
      const data = Array.from(new Set(tokCollectionAddr));
      const _data = await Promise.all(
        data.map(async (res) => {
          const res1 = await stargazeIndexerClient?.query<{
            collection: Collection;
          }>({
            query: COLLECTION_DATA,
            variables: {
              collectionAddr: res,
            },
          });
          return res1?.data?.collection;
        })
      );
      return _data;
    },
    queryKey: ["collection", walletQueryData?.data?.tokens?.total],
  });
  console.log({
    DATA: walletQueryData.data,
    collectionQueries: collectionQueries?.data,
  });
  // const { data: fullData, isLoading: fullyLoading } = useQuery(
  //   [FULL_WALLET_NFTS, myAddress, partialData],
  //   async () => {
  //     const data = await WalletNFTsService.requestNFTs(networkName, myAddress);

  //     if (data.state === WALLET_NFT_STATE.isUpdating) {
  //       return Promise.reject(new Error("Not loaded fully reject!"));
  //     }

  //     if (data.state === WALLET_NFT_STATE.Partial) {
  //       refetchPartial();
  //       return Promise.reject(new Error("Loaded partially return!"));
  //     }

  //     return data;
  //   },
  //   {
  //     enabled: !!partialData && !!myAddress,
  //     retry: true,
  //   }
  // );

  const ownedCollections =
    collectionQueries?.data ?? walletQueryData.data?.collections?.collections;

  const ownedNFTs = React.useMemo(() => {
    return (walletQueryData.data?.tokens?.tokens! ?? [])
      .filter(
        (nft) =>
          // Filter by collections
          (filters.collectionAddresses.length
            ? filters.collectionAddresses.includes(nft.collectionAddr)
            : true) &&
          // Filter by name %LIKE
          (filters.name
            ? (nft?.name || "")
                .toLowerCase()
                .match(`${filters.name.toLowerCase()}.*`)
            : true)
      )
      .sort(
        (a, b) =>
          (filters.sort === NFTS_SORT_VALUE.ASCENDING ? 1 : -1) *
          (a?.name || "")
            .toLowerCase()
            .localeCompare((b?.name || "").toLowerCase())
      );
  }, [
    walletQueryData.data?.tokens?.tokens?.length,
    filters.sort,
    filters.name,
    filters.collectionAddresses?.length,
  ]);

  return {
    ownedNFTs,
    ownedCollections,
    partiallyLoading,
    fullyLoading:false,
    fetchMyNFTs: refetchPartial,
    collectionQueries,
    walletQueryData,
  };
}

export default useMyNFTs;
