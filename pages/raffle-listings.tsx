import React, { useCallback, useEffect, useState } from "react";
// import { useTranslation } from 'next-i18next'
import { useDebounce } from "react-use";
import NiceModal from "@ebay/nice-modal-react";
import { useQuery } from "@tanstack/react-query";
import { Box, Flex } from "theme-ui";

// import { makeStaticPaths, makeStaticProps } from '../lib'
import useHeaderActions from "../hooks/useHeaderActions";
import CreateRaffleListing from "../components/shared/header-actions/create-raffle-listing/CreateRaffleListing";
import {
  FAVORITES_RAFFLES,
  RAFFLES,
  VERIFIED_COLLECTIONS,
} from "../constants/useQueryKeys";

import useAddress from "../hooks/useAddress";
import {
  Raffle,
  RafflesService,
  RAFFLE_STATE,
} from "../services/api/rafflesService";
import { FavoriteRafflesService } from "../services/api/favoriteRafflesService";
import { GRID_TYPE } from "../components/shared/raffle/GridController";
import {
  AccordionContentWrapper,
  DesktopFiltersSection,
  FilterButton,
  FiltersButtonContainer,
  FiltersButtonLabel,
  FiltersSection,
  GridSwitchContainer,
  ListingsNFTsContainer,
  SearchInputContainer,
  TabsSection,
} from "../components/raffle-listings";
import {
  CollectionsBoxesIcon,
  FilterIcon,
  TargetIcon,
} from "../assets/icons/mixed";
import useIsTablet from "../hooks/react/useIsTablet";
import { SupportedCollectionsService } from "../services/api";
import { RAFFLE_LISTINGS_TYPE } from "../constants/listings";
import { RaffleGridController } from "../components/shared/raffle";
import {
  RaffleListingsFilterModal,
  RaffleListingsFilterModalProps,
} from "../components/raffle-listings/modals";
import { asyncAction } from "../utils/js/asyncAction";
import { LayoutContainer, Page } from "../components/layout";
import {
  Accordion,
  AccordionTitle,
  Button,
  CheckboxCard,
  GridSwitch,
  MultiSelectAccordionInput,
  MultiSelectAccordionInputOption,
  SearchInput,
  Tab,
  Tabs,
} from "../components/ui";
import networkUtils, {
  CHAIN_NAMES,
  getNetworkName,
} from "../utils/blockchain/networkUtils";
import { useChain } from "@cosmos-kit/react";
import { RaffleClient } from "@/services/blockchain/contracts/raffles/Raffle.client";
import { AllRafflesResponse } from "@/services/blockchain/contracts/raffles/Raffle.types";

// const getStaticProps = makeStaticProps(['common', 'raffle-listings'])
// const getStaticPaths = makeStaticPaths()
// export { getStaticPaths, getStaticProps }

export default function RaffleListings() {
  useHeaderActions(<CreateRaffleListing />);
  const { sign, getSigningCosmWasmClient, address, getCosmWasmClient } =
    useChain(CHAIN_NAMES[1]);
  const [listingsType, setListingsType] = React.useState(
    RAFFLE_LISTINGS_TYPE.ALL_LISTINGS
  );
  const Raffle_comp = useCallback(async () => {
    const client = await getSigningCosmWasmClient();
    const contractAddr = networkUtils.getContractAddress("raffle");
    return new RaffleClient(client, address!, contractAddr);
  }, [address]);
  const myAddress = useAddress();

  const { data: _raffles, isLoading: rafflesLoading } = useQuery({
    queryKey: ["raffles", address],
    queryFn: async () => {
      if (!address) return null;
      const raffle_client = await Raffle_comp();
      const raf = await raffle_client.allRaffles({});
      return raf;
    },
  });
  const [raffleListing, setRaffleListing] = useState(
    _raffles || ({} as AllRafflesResponse)
  );
  console.log({ raffleListing });
  useEffect(() => {
    if (
      listingsType === RAFFLE_LISTINGS_TYPE.ALL_LISTINGS &&
      _raffles?.raffles?.length
    ) {
      setRaffleListing(_raffles);
    }
    if (
      listingsType === RAFFLE_LISTINGS_TYPE.MY_LISTINGS &&
      _raffles?.raffles?.length
    ) {
      setRaffleListing({
        raffles: _raffles?.raffles?.filter(
          (val) => val?.raffle_info?.owner == myAddress
        ),
      });
    }
    if (
      listingsType === RAFFLE_LISTINGS_TYPE.PAST_LISTINGS &&
      _raffles?.raffles?.length
    ) {
      setRaffleListing({
        raffles: _raffles?.raffles?.filter(
          (val) =>
            val?.raffle_state == RAFFLE_STATE.Finished ||
            val?.raffle_state == RAFFLE_STATE.Cancelled
        ),
      });
    }
  }, [listingsType, _raffles?.raffles?.length, myAddress]);
  const networkName = getNetworkName();

  const isTablet = useIsTablet();
  const [filtersExpanded, setFiltersExpanded] = React.useState(false);
  const { data: verifiedCollections, isFetched: verifiedCollectionsFetched } =
    useQuery(
      [VERIFIED_COLLECTIONS, networkName],
      async () =>
        SupportedCollectionsService.getSupportedCollections(networkName),
      {
        retry: true,
      }
    );

  const [
    startedStatusLabel,
    closedStatusLabel,
    finishedStatusLabel,
    cancelledStatusLabel,
    claimedStatusLabel,
  ]: Array<string> = ["Started", "Closed", "Finished", "Cancelled", "Claimed"];

  // t('raffle-listings:statuses', {
  // 	returnObjects: true,
  // })

  const statusOptions = [
    {
      label: startedStatusLabel,
      value: JSON.stringify([RAFFLE_STATE.Started]),
    },
    {
      label: closedStatusLabel,
      value: JSON.stringify([RAFFLE_STATE.Closed]),
    },
    {
      label: finishedStatusLabel,
      value: JSON.stringify([RAFFLE_STATE.Finished]),
    },
    {
      label: cancelledStatusLabel,
      value: JSON.stringify([RAFFLE_STATE.Cancelled]),
    },
    {
      label: claimedStatusLabel,
      value: JSON.stringify([RAFFLE_STATE.Claimed]),
    },
  ];

  const [defaultStatusOption] = statusOptions;

  const [gridType, setGridType] = React.useState(Boolean(GRID_TYPE.SMALL));

  const [search, setSearch] = React.useState("");

  const [sort, setSort] = React.useState<"ASC" | "DESC">("ASC");

  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  useDebounce(() => setDebouncedSearch(search), 800, [search]);

  const [page, setPage] = React.useState(1);

  const [statuses, setStatuses] = React.useState<
    MultiSelectAccordionInputOption[]
  >([defaultStatusOption]);

  const [collections, setCollections] = React.useState<
    MultiSelectAccordionInputOption[]
  >([]);

  const [myFavoritesChecked, setMyFavoritesChecked] = React.useState(false);

  const [participatedByMeChecked, setParticipatedByMeChecked] =
    React.useState(false);

  const [wonByMeChecked, setWonByMeChecked] = React.useState(false);


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

  // TODO extract this into hook, along with useQuery part.
  const [infiniteData, setInfiniteData] = React.useState<
    AllRafflesResponse["raffles"]
  >([]);
  React.useEffect(() => {
    setInfiniteData([]);
    setPage(1);
  }, [
    networkName,
    listingsType,
    statuses,
    collections,
    myFavoritesChecked,
    participatedByMeChecked,
    debouncedSearch,
    wonByMeChecked,
    myAddress,
  ]);

  React.useEffect(() => {
    const fnc = {
      [RAFFLE_LISTINGS_TYPE.MY_LISTINGS]: () => {
        setSort("ASC");
        setStatuses([]);
      },
      [RAFFLE_LISTINGS_TYPE.PAST_LISTINGS]: () => {
        setSort("DESC");
        setStatuses([
          {
            label: closedStatusLabel,
            value: JSON.stringify([RAFFLE_STATE.Closed]),
          },
          {
            label: finishedStatusLabel,
            value: JSON.stringify([RAFFLE_STATE.Finished]),
          },
          {
            label: claimedStatusLabel,
            value: JSON.stringify([RAFFLE_STATE.Claimed]),
          },
        ]);
      },
      [RAFFLE_LISTINGS_TYPE.ALL_LISTINGS]: () => {
        setSort("ASC");
        setStatuses([
          {
            label: startedStatusLabel,
            value: JSON.stringify([RAFFLE_STATE.Started]),
          },
        ]);
      },
    }[listingsType];

    fnc?.();
  }, [listingsType]);

  React.useEffect(() => {
    !!raffleListing &&
      setInfiniteData((prev) => [...prev, ...raffleListing?.raffles]);
  }, [raffleListing?.raffles?.length]);

  const onFiltersClick = async () => {
    if (!isTablet) {
      setFiltersExpanded((prevFiltersExpanded) => !prevFiltersExpanded);
      return;
    }
    if (!verifiedCollectionsFetched) {
      return;
    }

    const [, filters] = await asyncAction<RaffleListingsFilterModalProps>(
      NiceModal.show(RaffleListingsFilterModal, {
        statusOptions,
        verifiedCollections,
        statuses,
        collections,
        myFavoritesChecked,
        wonByMeChecked,
        participatedByMeChecked,
      } as RaffleListingsFilterModalProps)
    );

    if (filters) {
      setStatuses(filters.statuses);
      setCollections(filters.collections);
      setMyFavoritesChecked(filters.myFavoritesChecked);
      setParticipatedByMeChecked(filters.participatedByMeChecked);
      setWonByMeChecked(filters.wonByMeChecked);
    }
  };

  return (
    <Page
      title="Raffles - AtlasDAO App" // {t('title')}
    >
      <LayoutContainer>
        <Box sx={{ minHeight: "1248px" }}>
          <TabsSection>
            <Tabs
              onChange={(e) =>
                setListingsType(e.target.value as RAFFLE_LISTINGS_TYPE)
              }
              value={listingsType}
              name="listings"
            >
              <Tab value={RAFFLE_LISTINGS_TYPE.ALL_LISTINGS}>
                {/* {t('raffle-listings:tabs:all-listings')} */}
                All Raffles
              </Tab>
              <Tab value={RAFFLE_LISTINGS_TYPE.MY_LISTINGS}>
                {/* {t('raffle-listings:tabs:my-listings')} */}
                My Raffles
              </Tab>
              <Tab value={RAFFLE_LISTINGS_TYPE.PAST_LISTINGS}>
                {/* {t('raffle-listings:tabs:past-listings')} */}
                Past Raffles
              </Tab>
            </Tabs>
          </TabsSection>
          <FiltersSection>
            <SearchInputContainer>
              <SearchInput
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search" //{t('raffle-listings:filters:search-placeholder')}
              />
            </SearchInputContainer>

            <FiltersButtonContainer>
              <FilterButton onClick={onFiltersClick}>
                <FilterIcon />
                <FiltersButtonLabel>
                  {/* {t('common:filters-label')} */}
                  Filter
                </FiltersButtonLabel>
              </FilterButton>
            </FiltersButtonContainer>

            <GridSwitchContainer>
              <GridSwitch
                onChange={(e) => setGridType(e.target.checked)}
                checked={gridType}
              />
            </GridSwitchContainer>
          </FiltersSection>
          <ListingsNFTsContainer>
            {filtersExpanded && (
              <DesktopFiltersSection>
                <Box>
                  <Accordion
                    icon={<TargetIcon />}
                    title={
                      <AccordionTitle>
                        {/* {t('raffle-listings:filters:status-label')} */}
                        Status
                      </AccordionTitle>
                    }
                  >
                    <AccordionContentWrapper>
                      <MultiSelectAccordionInput
                        value={statuses}
                        onChange={(v) => setStatuses(v)}
                        accordionTitle="Status" // {t('raffle-listings:filters:status-label')}
                        options={statusOptions}
                      />
                    </AccordionContentWrapper>
                  </Accordion>
                </Box>
                <Box>
                  <Accordion
                    icon={<CollectionsBoxesIcon />}
                    title={
                      <AccordionTitle>
                        {/* {t('raffle-listings:filters:collections-label')} */}
                        Collections
                      </AccordionTitle>
                    }
                  >
                    <AccordionContentWrapper>
                      <MultiSelectAccordionInput
                        value={collections}
                        onChange={(v) => setCollections(v)}
                        accordionTitle="NFT Collection"
                        // {t(
                        // 	'raffle-listings:filters:nft-collections-search-label'
                        // )}
                        options={(verifiedCollections ?? [])?.map(
                          ({ collectionAddress, collectionName }) => ({
                            label: collectionName,
                            value: collectionAddress,
                          })
                        )}
                        placeholder="Search collections..."
                        // {t(
                        // 	'raffle-listings:filters:search-collections-placeholder'
                        // )}
                      />
                    </AccordionContentWrapper>
                  </Accordion>
                </Box>

                <Box mb="8px">
                  <CheckboxCard
                    variant="medium"
                    title="My favorites" //{t('raffle-listings:filters:my-favorites-label')}
                    onChange={(e) => setMyFavoritesChecked(e.target.checked)}
                    checked={myFavoritesChecked}
                  />
                </Box>
                <Box mb="8px">
                  <CheckboxCard
                    variant="medium"
                    title="Purchased tickets" //{t('raffle-listings:filters:participated-by-me-label')}
                    onChange={(e) =>
                      setParticipatedByMeChecked(e.target.checked)
                    }
                    checked={participatedByMeChecked}
                  />
                </Box>

                <Box mb="8px">
                  <CheckboxCard
                    variant="medium"
                    title="Won by me" //{t('raffle-listings:filters:won-by-me-label')}
                    onChange={(e) => setWonByMeChecked(e.target.checked)}
                    checked={wonByMeChecked}
                  />
                </Box>
              </DesktopFiltersSection>
            )}
            <Box sx={{ width: "100%" }}>
              <RaffleGridController
                raffles={raffleListing?.raffles!}
                isLoading={!raffleListing?.raffles.length && rafflesLoading}
                verifiedCollections={verifiedCollections}
                gridType={Number(gridType)}
                favoriteRaffles={favoriteRaffles}
              />
              <Flex sx={{ width: "100%", marginTop: "14px" }}>
                {raffleListing?.raffles &&
                  !!raffleListing?.raffles?.length &&
                  !rafflesLoading && (
                    <Button
                      // TODO uncomment
                      //   disabled={raffles?.page === raffles.pageCount}
                      fullWidth
                      variant="dark"
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      {/* {t('common:show-more')} */}
                      Show More
                    </Button>
                  )}
              </Flex>
            </Box>
          </ListingsNFTsContainer>
        </Box>
      </LayoutContainer>
    </Page>
  );
}
