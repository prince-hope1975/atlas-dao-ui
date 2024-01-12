import React, { useState } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Box, Flex, IconButton } from "theme-ui";
import { useTheme } from "@emotion/react";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
// import { useTranslation } from 'next-i18next'

import { ModalCloseIcon } from "@/assets/icons/modal";
import {
  Button,
  CheckboxCard,
  DropdownMultiselect,
  Modal,
  MultiSelectInputOption,
  SearchInput,
  SelectCard,
  Loader,
  Select,
} from "@/components/ui";

import useMyNFTs from "@/hooks/useMyNFTs";
import { NFT } from "@/services/api/walletNFTsService";

import { SupportedCollectionsService } from "@/services/api";
import { NFTS_SORT_VALUE } from "@/components/shared/modals/my-nfts-modal/MyNFTsModal.model";
import { SelectOption } from "@/components/ui/select/Select";
import { VERIFIED_COLLECTIONS } from "@/constants/useQueryKeys";
import { OnlyMobileAndTablet } from "@/components/layout";
import { NFTCard } from "@/components/shared/nft-card";
import { getNetworkName } from "@/utils/blockchain/networkUtils";
import useSelectedNFTs, {
  useSelectedStargazeNFTs,
} from "./hooks/useSelectedNFTs";
import {
  FiltersSection,
  ModalBody,
  ModalContent,
  ModalContentHeader,
  ModalHeader,
  ModalOverlay,
  NFTCardsGrid,
  NFTSelectionOverlay,
  SearchContainer,
  SortSelectContainer,
} from "./MyNFTsModal.styled";
import { ModalTitle } from "../common";
import { StargazeNFTCard } from "../../nft-card/NFTCard";

export interface MyNFTsModalProps {
  title?: string;
  children?: React.ReactNode;
  addNFTsButtonLabel?: string;
  inViewMode?: boolean;
  selectedNFTs?: NFT[];
}

export const MyNFTsModal = NiceModal.create(
  ({
    title,
    addNFTsButtonLabel,
    selectedNFTs: defaultSelectedNFTs = [],
    inViewMode = false,
  }: MyNFTsModalProps) => {
    const networkName = getNetworkName();
    const modal = useModal();
    const theme = useTheme();
    const [selectedCollections, setSelectedCollections] = React.useState<
      MultiSelectInputOption[]
    >([]);

    // const { t } = useTranslation(['common', 'trade', 'raffle'])

    const sortOptions: SelectOption[] = [
      {
        value: NFTS_SORT_VALUE.ASCENDING,
        // label: t('common:select-NFTs.a-to-z'),
        label: "A to Z",
      },
      {
        value: NFTS_SORT_VALUE.DESCENDING,
        // label: t('common:select-NFTs.z-to-a'),
        label: "Z to A",
      },
    ];

    const [defaultSort] = sortOptions;
    const [selectedSortValue, setSelectedSortValue] = useState(
      defaultSort.value
    );
    const [dropdownRefElement, setDropdownRefElement] =
      React.useState<HTMLDivElement | null>(null);
    const [searchName, setSearchName] = React.useState<string>("");

    const {
      partiallyLoading,
      fullyLoading,
      ownedNFTs,
      ownedCollections,
      fetchMyNFTs,
      walletQueryData,
    } = useMyNFTs({
      collectionAddresses: selectedCollections.map(({ value }) => value),
      name: searchName,
      sort: selectedSortValue as NFTS_SORT_VALUE,
    });

    const { data: verifiedCollections } = useQuery(
      [VERIFIED_COLLECTIONS],
      async () =>
        SupportedCollectionsService.getSupportedCollections(networkName),
      {
        retry: true,
      }
    );

    const { selectedNFTs, addSelectedNFT, removeSelectedNFT } =
      useSelectedNFTs(defaultSelectedNFTs);
    const {
      selectedNFTs: _selectedNFTs,
      addSelectedNFT: _addSelectedNFT,
      removeSelectedNFT: _removeSelectedNFT,
    } = useSelectedStargazeNFTs(walletQueryData?.data?.tokens?.tokens!);

    React.useEffect(() => {
      if (modal.visible) {
        fetchMyNFTs();
      }
    }, [modal.visible]);

    return (
      <Modal isOverHeader isOpen={modal.visible} onCloseModal={modal.remove}>
        <ModalOverlay>
          <ModalHeader>
            <ModalContent>
              <Box ml="auto" mr="-12px">
                <IconButton size="40px" onClick={modal.remove}>
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
                    <Box sx={{ ml: "auto" }}>
                      {!inViewMode && (
                        <Button
                          variant="gradient"
                          sx={{
                            display: ["none", "none", "flex"],
                            p: "10px 16px",
                            fontWeight: 400,
                          }}
                          fullWidth
                          onClick={() => {
                            modal.resolve(selectedNFTs);
                            modal.remove();
                          }}
                        >
                          {addNFTsButtonLabel}
                        </Button>
                      )}
                    </Box>
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
                <Flex
                  sx={{
                    flexDirection: "column",
                    flex: [1, 1, "unset"],
                    height: [null, null, "100%"],
                  }}
                >
                  <Flex
                    sx={{
                      gap: "12px",
                      minHeight: ["50px"],
                      pr: [0, 0, "10px"],
                    }}
                  >
                    <SearchContainer>
                      <SearchInput
                        // placeholder={t('common:select-NFTs.search')}
                        placeholder="Search"
                        onChange={(e) => setSearchName(e.target.value)}
                        value={searchName}
                      />
                    </SearchContainer>
                    <SortSelectContainer>
                      <Select
                        value={selectedSortValue}
                        options={sortOptions}
                        onChange={(value: string) =>
                          setSelectedSortValue(value)
                        }
                      />
                    </SortSelectContainer>
                  </Flex>
                  <Box
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: theme.zIndices.header,
                      bg: "dark100",
                    }}
                  >
                    <OnlyMobileAndTablet>
                      <Box sx={{ height: ["8px"] }} />
                      <Flex sx={{ height: ["50px"], gap: 10 }}>
                        <DropdownMultiselect
                          dropdownReferenceElement={dropdownRefElement}
                          label="Collections"
                          // placeholder={t('common:select-NFTs.type-here-to-search')}
                          placeholder="Type here to search..."
                          value={selectedCollections}
                          onChange={(collections) =>
                            setSelectedCollections(collections)
                          }
                          options={ownedCollections.map(
                            ({ collectionName, collectionAddress }) => ({
                              label: collectionName,
                              value: collectionAddress,
                            })
                          )}
                        />

                        <Select
                          dropdownReferenceElement={dropdownRefElement}
                          value={selectedSortValue}
                          options={sortOptions}
                          onChange={(value: string) =>
                            setSelectedSortValue(value)
                          }
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
                        mt: ["8px"],
                        display: ["flex", "flex", "none"],
                        pb: ["16px", "32px"],
                      }}
                    >
                      {!inViewMode && (
                        <Button
                          variant="gradient"
                          sx={{ p: "12px 0", fontWeight: 400 }}
                          fullWidth
                          onClick={() => {
                            modal.resolve(selectedNFTs);
                            modal.remove();
                          }}
                        >
                          {addNFTsButtonLabel}
                        </Button>
                      )}
                    </Flex>
                  </Box>

                  {/* {partiallyLoading || (fullyLoading && isEmpty(ownedNFTs)) ? (
                    <Flex
                      sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Loader
                        loadingText={
                          // t('common:loading')
                          "Loading"
                        }
                      />
                    </Flex>
                  ) : (
                    <Flex
                      sx={{
                        mt: [null, null, "36px"],
                        gap: "34px",
                        overflow: ["initial", "initial", "auto"],
                      }}
                    >
                      <FiltersSection>
                        {ownedCollections.map(
                          ({ collectionAddress, collectionName }) => {
                            const checked = selectedCollections
                              .map(({ value }) => value)
                              .includes(collectionAddress);

                            const setCollections = (
                              prevCollectionAddresses: MultiSelectInputOption[]
                            ): any => {
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
                          }
                        )}
                      </FiltersSection>

                      <Box
                        sx={{
                          overflow: ["initial", "initial", "auto"],
                          pr: [0, 0, "10px"],
                          width: "100%",
                        }}
                      >
                        <NFTCardsGrid>
                          {ownedNFTs.map((nft) => {
                            const checked = selectedNFTs.some(
                              ({ collectionAddress, tokenId }) =>
                                collectionAddress === nft.collectionAddress &&
                                tokenId === nft.tokenId
                            );

                            return (
                              <Box
                                key={`${nft.collectionAddress}_${nft.tokenId}`}
                              >
                                <NFTCard
                                  {...nft}
                                  verified={(verifiedCollections ?? []).some(
                                    ({ collectionAddress }) =>
                                      nft.collectionAddress ===
                                      collectionAddress
                                  )}
                                  onCardClick={() =>
                                    checked
                                      ? removeSelectedNFT(nft)
                                      : addSelectedNFT(nft)
                                  }
                                  checked={checked}
                                />
                              </Box>
                            );
                          })}
                        </NFTCardsGrid>
                      </Box>
                    </Flex>
                  )} */}
                  {/* TODO Fix later */}
                  {walletQueryData.loading ||
                  (walletQueryData.data &&
                    isEmpty(walletQueryData.data?.tokens?.tokens)) ? (
                    <Flex
                      sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Loader
                        loadingText={
                          // t('common:loading')
                          "Loading"
                        }
                      />
                    </Flex>
                  ) : (
                    <Flex
                      sx={{
                        mt: [null, null, "36px"],
                        gap: "34px",
                        overflow: ["initial", "initial", "auto"],
                      }}
                    >
                      <FiltersSection>
                        {walletQueryData.data?.collections?.collections?.map(
                          (
                            {
                              createdByAddr: collectionAddress,
                              name: collectionName,
							  collectionAddr,
                            },
                            idx
                          ) => {
                            const checked = selectedCollections
                              .map(({ value }) => value)
                              .includes(collectionAddr);

                            const setCollections = (
                              prevCollectionAddresses: MultiSelectInputOption[]
                            ) => {
                              if (checked) {
                                return selectedCollections.filter(
                                  (collection) =>
                                    collection.value !== collectionAddr
                                );
                              }
                              return [
                                ...prevCollectionAddresses,
                                {
                                  label: collectionName,
                                  value: collectionAddr,
                                },
                              ];
                            };

                            return (
                              <Box
                                key={collectionAddress + idx}
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
                          }
                        )}
                      </FiltersSection>

                      <Box
                        sx={{
                          overflow: ["initial", "initial", "auto"],
                          pr: [0, 0, "10px"],
                          width: "100%",
                        }}
                      >
                        <NFTCardsGrid>
                          {walletQueryData?.data?.tokens?.tokens?.map((nft) => {
                            const checked = selectedNFTs.some(
                              ({ collectionAddress, tokenId }) =>
                                collectionAddress === nft.collectionAddr &&
                                tokenId === nft.tokenId
                            );
                            const creatorAddr =
                              walletQueryData.data?.collections?.collections?.find(
                                (res) => {
									console.log({collect:res.collectionAddr ,nft:nft?.collectionAddr})
                                  return (
                                    res.collectionAddr == nft?.collectionAddr
                                  );
                                }
                              );
                            return (
                              <Box key={`${nft.collectionAddr}_${nft.tokenId}`}>
                                <StargazeNFTCard
                                  collectionName={creatorAddr?.name}
                                  {...nft}
                                  verified={(verifiedCollections ?? []).some(
                                    ({ collectionAddress }) =>
                                      nft.collectionAddr === collectionAddress
                                  )}
                                  onCardClick={() =>
                                    checked
                                      ? _removeSelectedNFT(nft)
                                      : _addSelectedNFT(nft)
                                  }
                                  checked={checked}
                                />
                              </Box>
                            );
                          })}
                        </NFTCardsGrid>
                      </Box>
                    </Flex>
                  )}
                </Flex>
              </Flex>

              {selectedNFTs.length > 0 && (
                <NFTSelectionOverlay>
                  <SelectCard
                    items={selectedNFTs}
                    onRemove={removeSelectedNFT}
                  />
                </NFTSelectionOverlay>
              )}
            </ModalContent>
          </ModalBody>
        </ModalOverlay>
      </Modal>
    );
  }
);

MyNFTsModal.defaultProps = {
  title: "My NFTs",
  addNFTsButtonLabel: "Add NFTs to Trade",
  selectedNFTs: [],
  inViewMode: false,
};
