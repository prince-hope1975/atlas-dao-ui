// import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from "react";
import NiceModal from "@ebay/nice-modal-react";
import useHeaderActions from "../hooks/useHeaderActions";
import { useQuery } from "@tanstack/react-query";
import { Box, Flex } from "theme-ui";

// import { makeStaticPaths, makeStaticProps } from 'lib'

import useAddress from "../hooks/useAddress";
import { GRID_TYPE } from "../components/shared/loan/GridController";
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
} from "../components/loan-listings";
import {
  CollectionsBoxesIcon,
  FilterIcon,
  TargetIcon,
} from "../assets/icons/mixed";
import useIsTablet from "../hooks/react/useIsTablet";
import { SupportedCollectionsService } from "../services/api";
import { useDebounce } from "react-use";
import MultiSelectAccordionInput, {
  MultiSelectAccordionInputOption,
} from "../components/ui/multi-select-accordion-input/MultiSelectAccordionInput";

import CreateLoanListing from "../components/shared/header-actions/create-loan-listing/CreateLoanListings";
import {
  FAVORITES_LOANS,
  LOANS,
  VERIFIED_COLLECTIONS,
} from "../constants/useQueryKeys";
import { FavoriteLoansService } from "../services/api/favoriteLoansService";
import { Loan, LoansService, LOAN_STATE } from "../services/api/loansService";
import { LoansGridController } from "../components/shared/loan";
import { LOAN_LISTINGS_TYPE } from "../constants/listings";
import {
  LoanListingsFilterModal,
  LoanListingsFilterModalProps,
} from "../components/loan-listings/modals/loan-listings-filters-modal";
import { asyncAction } from "../utils/js/asyncAction";
import { LayoutContainer, Page } from "../components/layout";
import {
  Accordion,
  AccordionTitle,
  Button,
  CheckboxCard,
  GridSwitch,
  SearchInput,
  Tab,
  Tabs,
} from "../components/ui";
import networkUtils, {
  CHAIN_NAMES,
  getNetworkName,
} from "../utils/blockchain/networkUtils";
import { useQuery as USE_QUERY, gql } from "@apollo/client";
import { useChain } from "@cosmos-kit/react";
import { NFTLoansQueryClient } from "@/services/blockchain/contracts/loans/NFTLoans.client";
import { Collateral } from "@/types/loan/types";

// const getStaticProps = makeStaticProps(['common', 'loan-listings'])
// const getStaticPaths = makeStaticPaths()
// export { getStaticPaths, getStaticProps }

export default function LoanListings() {
  // const { t } = useTranslation(['common', 'loan-listings'])

  //   stargazeIndexerClient.query({
  // 	query:gql``
  //   })
  const { data } = USE_QUERY(
    gql`
      query Collections {
        collections {
          collections {
            name
          }
        }
      }
    `
  );
  const networkName = getNetworkName();

  useHeaderActions(<CreateLoanListing />);

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

  const { sign, getSigningCosmWasmClient, address, getCosmWasmClient } =
    useChain(CHAIN_NAMES[1]);
  const [
    activeStatusLabel,
    inactiveStatusLabel,
    publishedStatusLabel,
    startedStatusLabel,
    defaultedStatusLabel,
    endedStatusLabel,
    withdrawnLabel,
  ]: Array<string> = [
    "Active",
    "Inactive",
    "Published",
    "Funded",
    "Defaulted",
    "Ended",
    "Withdrawn",
  ];
  //  Array<string> = t('loan-listings:statuses', {
  // 	returnObjects: true,
  // })

  const statusOptions = [
    {
      label: activeStatusLabel,
      value: JSON.stringify([
        LOAN_STATE.Published,
        LOAN_STATE.Started,
        LOAN_STATE.PendingDefault,
      ]),
    },
    {
      label: inactiveStatusLabel,
      value: JSON.stringify([LOAN_STATE.Ended, LOAN_STATE.Inactive]),
    },
    {
      label: publishedStatusLabel,
      value: JSON.stringify([LOAN_STATE.Published]),
    },
    {
      label: startedStatusLabel,
      value: JSON.stringify([LOAN_STATE.Started]),
    },
    {
      label: defaultedStatusLabel,
      value: JSON.stringify([LOAN_STATE.PendingDefault]),
    },
    {
      label: endedStatusLabel,
      value: JSON.stringify([LOAN_STATE.Ended]),
    },
    {
      label: withdrawnLabel,
      value: JSON.stringify([LOAN_STATE.Inactive, LOAN_STATE.Defaulted]),
    },
  ];

  const [defaultStatusOption] = statusOptions;

  const [gridType, setGridType] = React.useState(Boolean(GRID_TYPE.SMALL));

  const [search, setSearch] = React.useState("");

  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  useDebounce(() => setDebouncedSearch(search), 800, [search]);
  const [listingsType, setListingsType] = React.useState(
    LOAN_LISTINGS_TYPE.ALL_LISTINGS
  );

  const [page, setPage] = React.useState(1);

  const [statuses, setStatuses] = React.useState<
    MultiSelectAccordionInputOption[]
  >([defaultStatusOption]);

  const [collections, setCollections] = React.useState<
    MultiSelectAccordionInputOption[]
  >([]);

  const [myFavoritesChecked, setMyFavoritesChecked] = React.useState(false);

  const [counteredByMeChecked, setCounteredByMeChecked] = React.useState(false);

  const myAddress = useAddress();

  const { data: favoriteLoans } = useQuery(
    [FAVORITES_LOANS, networkName, myAddress],
    async () =>
      FavoriteLoansService.getFavoriteLoans(
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
  const [infiniteData, setInfiniteData] = React.useState<Collateral[]>([]);
  React.useEffect(() => {
    setInfiniteData([]);
    setPage(1);
  }, [
    networkName,
    listingsType,
    statuses,
    collections,
    myFavoritesChecked,
    counteredByMeChecked,
    debouncedSearch,
    myAddress,
  ]);

  const { data: loans = [], isLoading } = useQuery(
    [
      LOANS,
      networkName,
      statuses,
      collections,
      myFavoritesChecked,
      counteredByMeChecked,
      // debouncedSearch,
      // page,
      myAddress,
    ],
    async () => {
      const client = await getCosmWasmClient();
      const contractAddr = networkUtils.getContractAddress("loan");
      const queryClient = new NFTLoansQueryClient(client, contractAddr!);
      const ret = await queryClient?.allCollaterals({});
      return ret?.collaterals!;
    }

    // {
    //   enabled: !!favoriteLoans,
    //   retry: true,
    // }
  );
  const [loanListings, setLoanListing] = useState(
    loans || ([] as Collateral[])
  );
  const [filteredListing, setFilteredListing] = useState<null | Collateral[]>(
    loans || ([] as Collateral[])
  );

  useEffect(() => {
    if (listingsType === LOAN_LISTINGS_TYPE.ALL_LISTINGS && loans?.length) {
      setLoanListing(loans);
    }
    if (listingsType === LOAN_LISTINGS_TYPE.MY_LISTINGS && loans?.length) {
      setLoanListing(loans?.filter((val) => val?.borrower == myAddress));
    }
    if (listingsType === LOAN_LISTINGS_TYPE.FUNDED_BY_ME && loans?.length) {
      setLoanListing(
        []
        // loans?.filter(
        //   (val) =>
        //     val?.collateral?.state == LOAN_STATE.Finished
        // )
      );
    }
  }, [listingsType, loans?.length, myAddress]);
  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredListing(null);
    } else {
      setFilteredListing(
        loanListings?.filter((val) =>
          val?.collateral?.comment?.includes(debouncedSearch)||val?.collateral?.loan_preview
        )
      );
    }
  }, [debouncedSearch]);
  // TODO add later
  // React.useEffect(
  //   () => loans && setInfiniteData((prev) => [...(prev??[]), ...(loans??[])]),
  //   [loans?.length]
  // );

  const onFiltersClick = async () => {
    if (!isTablet) {
      setFiltersExpanded((prevFiltersExpanded) => !prevFiltersExpanded);
      return;
    }
    if (!verifiedCollectionsFetched) {
      return;
    }

    const [, filters] = await asyncAction<LoanListingsFilterModalProps>(
      NiceModal.show(LoanListingsFilterModal, {
        statusOptions,
        verifiedCollections,
        statuses,
        collections,
        myFavoritesChecked,
        counteredByMeChecked,
      } as LoanListingsFilterModalProps)
    );

    if (filters) {
      setStatuses(filters.statuses);
      setCollections(filters.collections);
      setMyFavoritesChecked(filters.myFavoritesChecked);
      setCounteredByMeChecked(filters.counteredByMeChecked);
    }
  };

  return (
    <Page
      title="NFT Loans - AtlasDAO App" //{t('title')}
    >
      <LayoutContainer>
        <Box sx={{ minHeight: "1248px" }}>
          <TabsSection>
            <Tabs
              onChange={(e) =>
                setListingsType(e.target.value as LOAN_LISTINGS_TYPE)
              }
              value={listingsType}
              name="listings"
            >
              <Tab value={LOAN_LISTINGS_TYPE.ALL_LISTINGS}>
                {/* {t('loan-listings:tabs:all-listings')} */}
                All
              </Tab>
              <Tab value={LOAN_LISTINGS_TYPE.MY_LISTINGS}>
                {/* {t('loan-listings:tabs:my-listings')} */}
                My Loans
              </Tab>
              {/* <Tab value={LOAN_LISTINGS_TYPE.FUNDED_BY_ME}>
                Funded by me
              </Tab> */}
              {/* {t('loan-listings:tabs:funded-by-me')} */}
            </Tabs>
          </TabsSection>
          <FiltersSection>
            <SearchInputContainer>
              <SearchInput
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Search" // {t('loan-listings:filters:search-placeholder')}
              />
            </SearchInputContainer>

            <FiltersButtonContainer>
              <FilterButton onClick={onFiltersClick}>
                <FilterIcon />
                <FiltersButtonLabel>
                  {/* {t('common:filters-label')} */}
                  Filters
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
                        {/* {t('loan-listings:filters:status-label')} */}
                        Status
                      </AccordionTitle>
                    }
                  >
                    <AccordionContentWrapper>
                      <MultiSelectAccordionInput
                        value={statuses}
                        onChange={(v) => setStatuses(v)}
                        accordionTitle="Status" //{t('loan-listings:filters:status-label')}
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
                        {/* {t('loan-listings:filters:collections-label')} */}
                        Collections
                      </AccordionTitle>
                    }
                  >
                    <AccordionContentWrapper>
                      <MultiSelectAccordionInput
                        value={collections}
                        onChange={(v) => setCollections(v)}
                        accordionTitle="Search collections..."
                        // {t(
                        // 	'loan-listings:filters:nft-collections-search-label'
                        // )}
                        options={(verifiedCollections ?? [])?.map(
                          ({ collectionAddress, collectionName }) => ({
                            label: collectionName,
                            value: collectionAddress,
                          })
                        )}
                        placeholder="Search collections..."
                        // {t(
                        // 	'loan-listings:filters:search-collections-placeholder'
                        // )}
                      />
                    </AccordionContentWrapper>
                  </Accordion>
                </Box>

                <Box mb="8px">
                  <CheckboxCard
                    variant="medium"
                    title="Countered by me" //{t('loan-listings:filters:countered-by-me-label')}
                    onChange={(e) => setCounteredByMeChecked(e.target.checked)}
                    checked={counteredByMeChecked}
                  />
                </Box>

                <Box mb="8px">
                  <CheckboxCard
                    variant="medium"
                    title="My favorites" //{t('loan-listings:filters:my-favorites-label')}
                    onChange={(e) => setMyFavoritesChecked(e.target.checked)}
                    checked={myFavoritesChecked}
                  />
                </Box>
              </DesktopFiltersSection>
            )}
            <Box sx={{ width: "100%" }}>
              <LoansGridController
                loans={loanListings!}
                isLoading={!loanListings?.length && isLoading}
                verifiedCollections={verifiedCollections}
                gridType={Number(gridType)}
                favoriteLoans={favoriteLoans}
              />
              <Flex sx={{ width: "100%", marginTop: "14px" }}>
                {(loanListings?.length ?? 0) > 0 &&
                  !!loanListings?.length &&
                  !isLoading && (
                    <Button
                      // disabled={loans?.page === loans.pageCount}
                      disabled
                      fullWidth
                      variant="dark"
                      onClick={() => setPage((prev) => prev + 1)}
                    >
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
