import React, { useEffect } from "react";
import { NFT } from "@/services/api/walletNFTsService";
import { Token } from "@/services/api/gqlWalletSercice";

export default function useSelectedNFTs(defaultSelectedNFTs) {
  const [selectedNFTs, setSelectedNFTs] =
    React.useState<NFT[]>(defaultSelectedNFTs);

  const addSelectedNFT = (nft: NFT) => {
    setSelectedNFTs((prevNFTs) => [...prevNFTs, nft]);
  };

  const removeSelectedNFT = (nft: NFT) => {
    setSelectedNFTs((prevState) =>
      prevState.filter(
        ({ collectionAddress, tokenId }) =>
          !(
            collectionAddress === nft.collectionAddress &&
            tokenId === nft.tokenId
          )
      )
    );
  };

  return {
    selectedNFTs,
    addSelectedNFT,
    removeSelectedNFT,
  };
}
export function useSelectedStargazeNFTs(defaultSelectedNFTs: Token[]) {
  const [selectedNFTs, setSelectedNFTs] = React.useState(
    defaultSelectedNFTs || []
  );
  useEffect(() => {
    if (defaultSelectedNFTs) {
      setSelectedNFTs(defaultSelectedNFTs || []);
    }
  }, [defaultSelectedNFTs?.length]);

  const addSelectedNFT = (nft: Token) => {
    setSelectedNFTs((prevNFTs) => [...prevNFTs, nft]);
  };

  const removeSelectedNFT = (nft: Token) => {
    setSelectedNFTs((prevState) =>
      prevState.filter(
        ({ collectionAddr: collectionAddress, id: tokenId }) =>
          !(collectionAddress === nft.collectionAddr && tokenId === nft.tokenId)
      )
    );
  };

  return {
    selectedNFTs,
    addSelectedNFT,
    removeSelectedNFT,
  };
}
