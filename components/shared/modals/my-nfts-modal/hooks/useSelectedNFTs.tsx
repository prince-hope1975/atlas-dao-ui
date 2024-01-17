import React, { useEffect } from "react";
import { Token } from "@/services/api/gqlWalletSercice";

export function useSelectedStargazeNFTs(defaultSelectedNFTs: Token[]) {
  const [selectedNFTs, setSelectedNFTs] = React.useState(
    [] as typeof defaultSelectedNFTs
  );

  const addSelectedNFT = (nft: Token) => {
    setSelectedNFTs((prevNFTs) => [...prevNFTs, nft]);
  };

  const removeSelectedNFT = (nft: Token) => {
    setSelectedNFTs((prevState) =>
      prevState.filter(
        ({ collectionAddr: collectionAddress,  tokenId }) =>
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

// export default function useSelectedNFTs(defaultSelectedNFTs) {
//   const [selectedNFTs, setSelectedNFTs] =
//     React.useState<NFT[]>(defaultSelectedNFTs);

//   const addSelectedNFT = (nft: NFT) => {
//     setSelectedNFTs((prevNFTs) => [...prevNFTs, nft]);
//   };

//   const removeSelectedNFT = (nft: NFT) => {
//     setSelectedNFTs((prevState) =>
//       prevState.filter(
//         ({ collectionAddress, tokenId }) =>
//           !(
//             collectionAddress === nft.collectionAddress &&
//             tokenId === nft.tokenId
//           )
//       )
//     );
//   };

//   return {
//     selectedNFTs,
//     addSelectedNFT,
//     removeSelectedNFT,
//   };
// }