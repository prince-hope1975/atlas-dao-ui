import React from "react";
// import { useTranslation } from 'next-i18next'
import { uniqBy } from "lodash";
import { Box, Flex, IconButton } from "theme-ui";
import { useQuery } from "@tanstack/react-query";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useTheme } from "@emotion/react";
import { ModalCloseIcon } from "@/assets/icons/modal";
import {
  CheckboxCard,
  DropdownMultiselect,
  Modal,
  MultiSelectInputOption,
  SearchInput,
} from "@/components/ui";

import { OnlyMobileAndTablet } from "@/components/layout/layout";

import { SupportedCollectionsService } from "@/services/api/supportedCollectionsService";
import { VERIFIED_COLLECTIONS } from "@/constants/useQueryKeys";
import { NFTCard } from "@/components/shared/nft-card";
import { getNetworkName } from "@/utils/blockchain/networkUtils";
import {
  FiltersSection,
  ModalBody,
  ModalContent,
  ModalContentHeader,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  NFTCardsGrid,
  SearchContainer,
} from "./ViewNFTsModal.styled";
import { Sg721Token } from "@/services/blockchain/contracts/raffles/Raffle.types";
import { useCollections as useGetCollectionsFromSG721_token } from "@/hooks/useCollections";
import { TokenResponse } from "@/hooks/useTokens";
import { getImageUrl } from "@/lib/getImageUrl";

export interface ViewNFTsModalProps {
  title?: string;
  children?: React.ReactNode;
  nfts: TokenResponse[];
  nftResponse: TokenResponse[];
}

export interface ViewNFTsModalResult {
  nft: Sg721Token;
}

export const ViewNFTsModal = NiceModal.create(
  ({ title, nfts, nftResponse }: ViewNFTsModalProps) => {
    // 	const { t } = useTranslation()
    const modal = useModal();
    const theme = useTheme();
    const networkName = getNetworkName();

    const { data: collections } = useGetCollectionsFromSG721_token(
      nfts?.map((res) => ({
        address: res?.token?.collectionAddr,
        token_id: res?.token?.tokenId,
      }))
    );
    // console.log({ nfts, nftResponse ,collections});
    const { data: verifiedCollections } = useQuery(
      [VERIFIED_COLLECTIONS],
      async () =>
        SupportedCollectionsService.getSupportedCollections(networkName),
      {
        retry: true,
      }
    );

    const availableCollections = uniqBy(
      collections,
      (col) => col?.collection?.collectionAddr
    );
    const [selectedCollections, setSelectedCollections] = React.useState<
      MultiSelectInputOption[]
    >([]);

    const [dropdownRefElement, setDropdownRefElement] =
      React.useState<HTMLDivElement | null>(null);
    const [searchName, setSearchName] = React.useState<string>("");

    const filteredNFTs = nfts?.filter(
      (nft) =>
        (selectedCollections.length
          ? selectedCollections
              .map(({ value }) => value)
              .includes(nft?.token?.collectionAddr)
          : true) &&
        (searchName
          ? (nft?.token?.name || "")
              .toLowerCase()
              .match(`${searchName.toLowerCase()}.*`)
          : true)
    );
    return (
      <Modal isOverHeader isOpen={modal.visible} onCloseModal={modal.remove}>
        <ModalOverlay>
          <ModalHeader>
            <ModalContent>
              <Box ml="auto" mr="-12px">
                <IconButton size="40px" onClick={modal.hide}>
                  <ModalCloseIcon />
                </IconButton>
              </Box>
            </ModalContent>
          </ModalHeader>

          <ModalBody>
            <ModalContent>
              <Flex sx={{ flexDirection: "column" }}>
                <ModalContentHeader>
                  <Flex sx={{ width: "100%" }}>
                    <ModalTitle>{title}</ModalTitle>
                  </Flex>
                  <OnlyMobileAndTablet>
                    <IconButton size="40px" onClick={modal.hide}>
                      <ModalCloseIcon fill={theme.colors.dark500} />
                    </IconButton>
                  </OnlyMobileAndTablet>
                </ModalContentHeader>
              </Flex>

              <Flex
                sx={{
                  overflow: "auto",
                  marginTop: ["16px", "32px"],
                  pr: ["10px", "10px", 0],
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <Flex sx={{ flexDirection: "column", height: "100%" }}>
                  <Flex
                    sx={{
                      gap: "12px",
                      minHeight: ["50px"],
                      pr: [0, 0, "10px"],
                    }}
                  >
                    <SearchContainer>
                      <SearchInput
                        onChange={(e) => setSearchName(e.target.value)}
                        value={searchName}
                        // placeholder={t('common:search')}
                        placeholder="Search"
                      />
                    </SearchContainer>
                  </Flex>
                  <OnlyMobileAndTablet>
                    <Box sx={{ height: ["8px"] }} />
                    <Flex sx={{ height: ["50px"], gap: 10 }}>
                      <DropdownMultiselect
                        dropdownReferenceElement={dropdownRefElement}
                        label="Collections"
                        value={selectedCollections}
                        onChange={(collections) =>
                          setSelectedCollections(collections)
                        }
                        options={availableCollections
                          .filter((res) => res?.collection)
                          .map(
                            ({
                              collection: {
                                collectionAddr: collectionAddress,
                                name: collectionName,
                              },
                            }) => ({
                              label: collectionName,
                              value: collectionAddress,
                            })
                          )}
                      />
                    </Flex>
                    <div
                      ref={setDropdownRefElement}
                      style={{
                        width: "100%",
                        height: "0px",
                      }}
                    />
                  </OnlyMobileAndTablet>

                  <Flex
                    sx={{
                      mt: ["16px", "32px", "36px"],
                      gap: "34px",
                      overflow: ["initial", "initial", "auto"],
                    }}
                  >
                    <FiltersSection>
                      {availableCollections?.map((items) => {
                        if (!items?.collection) return;
                        const { collection }=items
                        const {
                          collectionAddr: collectionAddress,
                          name: collectionName,
                        } = collection;
                        const checked = selectedCollections
                          .map(({ value }) => value)
                          .includes(collectionAddress);

                        const setCollections = (
                          prevCollectionAddresses: MultiSelectInputOption[]
                        ) => {
                          if (checked) {
                            return selectedCollections.filter(
                              (collection) =>
                                collection.value !== collectionAddress
                            );
                          }
                          return [
                            ...prevCollectionAddresses,
                            {
                              label: collectionName,
                              value: collectionAddress,
                            },
                          ];
                        };

                        return (
                          <Box
                            key={collectionAddress}
                            sx={{ flex: 1, maxHeight: "66px" }}
                          >
                            <CheckboxCard
                              checked={checked}
                              onChange={() =>
                                setSelectedCollections(setCollections)
                              }
                              title={collectionName}
                            />
                          </Box>
                        );
                      })}
                    </FiltersSection>

                    <Flex
                      sx={{
                        overflow: ["initial", "initial", "auto"],
                        pr: [0, 0, "10px"],
                        width: "100%",
                      }}
                    >
                      <NFTCardsGrid>
                        {filteredNFTs?.map((nft, idx) => {
                          const collectionInfo = collections?.find(
                            (res) =>
                              res?.collection?.collectionAddr ===
                              nft?.token?.collectionAddr
                          );
                          return (
                            <Box
                              key={`${nft?.token?.collectionAddr}_${
                                nft?.token?.tokenId ?? idx
                              }`}
                            >
                              <NFTCard
                                {...nft}
                                imageUrl={[getImageUrl(nft?.token?.imageUrl!)]}
                                name={nft?.token?.name!}
                                collectionName={
                                  collectionInfo?.collection?.name ??
                                  nft?.token?.name!
                                }
                                verified={(verifiedCollections ?? []).some(
                                  ({ collectionAddress }) =>
                                    nft?.token?.collectionAddr ===
                                    collectionAddress
                                )}
                                onCardClick={() => {
                                  modal.resolve({
                                    nft,
                                  });
                                  modal.remove();
                                }}
                                checked={false}
                              />
                            </Box>
                          );
                        })}
                      </NFTCardsGrid>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </ModalContent>
          </ModalBody>
        </ModalOverlay>
      </Modal>
    );
  }
);

ViewNFTsModal.defaultProps = {
  title: "All NFTs",
};
