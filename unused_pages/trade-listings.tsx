// import React from 'react'
// import { Box, Flex } from 'theme-ui'
// // import { useTranslation } from 'next-i18next'
// import NiceModal from '@ebay/nice-modal-react'
// import { useQuery } from '@tanstack/react-query'
// import { useDebounce } from 'react-use'

// import {
// 	CollectionsBoxesIcon,
// 	FilterIcon,
// 	LookingForCompassIcon,
// 	TargetIcon,
// } from '../assets/icons/mixed'

// import {
// 	Accordion,
// 	AccordionTitle,
// 	Button,
// 	CheckboxCard,
// 	GridSwitch,
// 	MultiSelectAccordionInput,
// 	SearchInput,
// 	Tab,
// 	Tabs,
// } from '../components/ui'

// import { MultiSelectAccordionInputOption } from '../components/ui/multi-select-accordion-input/MultiSelectAccordionInput'
// import useIsTablet from '../hooks/react/useIsTablet'
// // import { makeStaticPaths, makeStaticProps } from 'lib'
// import { SupportedCollectionsService } from '../services/api'
// import { Trade, TradesService, TRADE_STATE } from '../services/api/tradesService'

// import { asyncAction } from '../utils/js/asyncAction'

// import {
// 	AccordionContentWrapper,
// 	DesktopFiltersSection,
// 	FilterButton,
// 	FiltersButtonContainer,
// 	FiltersButtonLabel,
// 	FiltersSection,
// 	GridSwitchContainer,
// 	ListingsNFTsContainer,
// 	SearchInputContainer,
// 	TabsSection,
// 	TradeListingsFilterModal,
// 	TradeListingsFilterModalProps,
// } from '../components/trade-listings'
// import useHeaderActions from '../hooks/useHeaderActions'

// import useAddress from '../hooks/useAddress'
// import {
// 	FAVORITES_TRADES,
// 	TRADES,
// 	VERIFIED_COLLECTIONS,
// } from '../constants/useQueryKeys'
// import CreateTradeListing from '../components/shared/header-actions/create-trade-listing/CreateTradeListing'
// import { FavoriteTradesService } from '../services/api/favoriteTradesService'
// import { TRADE_LISTINGS_TYPE } from '../constants/listings'
// import { GRID_TYPE, TradeGridController } from '../components/shared/trade'
// import { LayoutContainer, Page } from '../components/layout'
// import { getNetworkName } from '../utils/blockchain/networkUtils'

// // const getStaticProps = makeStaticProps(['common', 'trade-listings'])
// // const getStaticPaths = makeStaticPaths()
// // export { getStaticPaths, getStaticProps }

// export default function TradeListings() {
// 	// const { t } = useTranslation(['common', 'trade-listings'])
// 	const networkName = getNetworkName()

// 	useHeaderActions(<CreateTradeListing />)

// 	const isTablet = useIsTablet()
// 	const [filtersExpanded, setFiltersExpanded] = React.useState(false)
// 	const { data: verifiedCollections, isFetched: verifiedCollectionsFetched } =
// 		useQuery(
// 			[VERIFIED_COLLECTIONS, networkName],
// 			async () => SupportedCollectionsService.getSupportedCollections(networkName),
// 			{
// 				retry: true,
// 			}
// 		)

// 	// const statusesLabels: Array<string> = t('trade-listings:statuses', {
// 	// 	returnObjects: true,
// 	// })
// 	const statusesLabels: Array<string> = [
// 		"Active",
// 		"Inactive",
// 		"Cancelled",
// 		"Published",
// 		"Countered",
// 		"Accepted"
// 	]
// 	const statusOptions = [
// 		{
// 			label: statusesLabels[0],
// 			value: JSON.stringify([TRADE_STATE.Published, TRADE_STATE.Countered]),
// 		},
// 		{
// 			label: statusesLabels[1],
// 			value: JSON.stringify([TRADE_STATE.Cancelled, TRADE_STATE.Accepted]),
// 		},
// 		{
// 			label: statusesLabels[2],
// 			value: JSON.stringify([TRADE_STATE.Cancelled]),
// 		},
// 		{
// 			label: statusesLabels[3],
// 			value: JSON.stringify([TRADE_STATE.Published]),
// 		},
// 		{
// 			label: statusesLabels[4],
// 			value: JSON.stringify([TRADE_STATE.Countered]),
// 		},
// 		{
// 			label: statusesLabels[5],
// 			value: JSON.stringify([TRADE_STATE.Accepted]),
// 		},
// 	]
// 	const [gridType, setGridType] = React.useState(Boolean(GRID_TYPE.SMALL))

// 	const [search, setSearch] = React.useState('')

// 	const [debouncedSearch, setDebouncedSearch] = React.useState('')

// 	useDebounce(() => setDebouncedSearch(search), 800, [search])

// 	const [listingsType, setListingsType] = React.useState(
// 		TRADE_LISTINGS_TYPE.ALL_LISTINGS
// 	)

// 	const [page, setPage] = React.useState(1)

// 	const [statuses, setStatuses] = React.useState<
// 		MultiSelectAccordionInputOption[]
// 	>([statusOptions[0]])
// 	const [lookingForCollections, setLookingForCollections] = React.useState<
// 		MultiSelectAccordionInputOption[]
// 	>([])
// 	const [collections, setCollections] = React.useState<
// 		MultiSelectAccordionInputOption[]
// 	>([])

// 	const [myFavoritesChecked, setMyFavoritesChecked] = React.useState(false)

// 	const [counteredByMeChecked, setCounteredByMeChecked] = React.useState(false)

// 	const [lookingForLiquidAssetsChecked, setLookingForLiquidAssetsChecked] =
// 		React.useState(false)

// 	const myAddress = useAddress()

// 	const { data: favoriteTrades } = useQuery(
// 		[FAVORITES_TRADES, networkName, myAddress],
// 		async () =>
// 			FavoriteTradesService.getFavoriteTrades(
// 				{ network: networkName },
// 				{
// 					users: [myAddress],
// 				}
// 			),
// 		{
// 			enabled: !!myAddress,
// 			retry: true,
// 		}
// 	)

// 	// TODO extract this into hook, along with useQuery part.
// 	const [infiniteData, setInfiniteData] = React.useState<Trade[]>([])
// 	React.useEffect(() => {
// 		setInfiniteData([])
// 		setPage(1)
// 	}, [
// 		listingsType,
// 		statuses,
// 		lookingForCollections,
// 		collections,
// 		myFavoritesChecked,
// 		counteredByMeChecked,
// 		lookingForLiquidAssetsChecked,
// 		debouncedSearch,
// 		myAddress,
// 	])

// 	const { data: trades, isLoading } = useQuery(
// 		[
// 			TRADES,
// 			networkName,
// 			listingsType,
// 			statuses,
// 			lookingForCollections,
// 			collections,
// 			myFavoritesChecked,
// 			counteredByMeChecked,
// 			lookingForLiquidAssetsChecked,
// 			debouncedSearch,
// 			myAddress,
// 			page,
// 		],
// 		async () =>
// 			TradesService.getAllTrades(
// 				networkName,
// 				{
// 					owners:
// 						listingsType === TRADE_LISTINGS_TYPE.MY_LISTINGS
// 							? [myAddress]
// 							: undefined,
// 					states: statuses.flatMap(({ value }) => JSON.parse(value)),
// 					collections: collections.map(({ value }) => value),
// 					lookingFor: lookingForCollections.map(({ value }) => value),
// 					counteredBy: counteredByMeChecked ? [myAddress] : undefined,
// 					hasLiquidAsset: lookingForLiquidAssetsChecked,
// 					search: debouncedSearch,
// 					myAddress,
// 					favoritesOf: myFavoritesChecked ? myAddress : undefined,
// 				},
// 				{
// 					page,
// 					limit: 28,
// 				}
// 			),
// 		{
// 			enabled: !!favoriteTrades,
// 			retry: true,
// 		}
// 	)

// 	React.useEffect(
// 		() => trades && setInfiniteData(prev => [...prev, ...trades.data]),
// 		[trades]
// 	)

// 	const onFiltersClick = async () => {
// 		if (!isTablet) {
// 			setFiltersExpanded(prevFiltersExpanded => !prevFiltersExpanded)
// 			return
// 		}
// 		if (!verifiedCollectionsFetched) {
// 			return
// 		}
// 		const [, filters] = await asyncAction<TradeListingsFilterModalProps>(
// 			NiceModal.show(TradeListingsFilterModal, {
// 				statusOptions,
// 				verifiedCollections,
// 				statuses,
// 				lookingForCollections,
// 				collections,
// 				counteredByMeChecked,
// 				myFavoritesChecked,
// 				lookingForLiquidAssetsChecked,
// 			})
// 		)

// 		if (filters) {
// 			setStatuses(filters.statuses)
// 			setCollections(filters.collections)
// 			setLookingForCollections(filters.lookingForCollections)
// 			setCounteredByMeChecked(filters.counteredByMeChecked)
// 			setMyFavoritesChecked(filters.myFavoritesChecked)
// 			setLookingForLiquidAssetsChecked(filters.lookingForLiquidAssetsChecked)
// 		}
// 	}

// 	return (
// 		<Page title="Title" // {t('title')}
// 		>
// 			<LayoutContainer>
// 				<Box sx={{ minHeight: '1248px' }}>
// 					<TabsSection>
// 						<Tabs
// 							onChange={e => setListingsType(e.target.value as TRADE_LISTINGS_TYPE)}
// 							value={listingsType}
// 							name='listings'
// 						>
// 							<Tab value={TRADE_LISTINGS_TYPE.ALL_LISTINGS}>
// 								{/* {t('trade-listings:tabs:all-listings')} */}
// 								All Listings
// 							</Tab>
// 							<Tab value={TRADE_LISTINGS_TYPE.MY_LISTINGS}>
// 								{/* {t('trade-listings:tabs:my-listings')} */}
// 								My Listings
// 							</Tab>
// 						</Tabs>
// 					</TabsSection>
// 					<FiltersSection>
// 						<SearchInputContainer>
// 							<SearchInput
// 								onChange={e => setSearch(e.target.value)}
// 								value={search}
// 								placeholder="Search" // {t('trade-listings:filters:search-placeholder')}
// 							/>
// 						</SearchInputContainer>

// 						<FiltersButtonContainer>
// 							<FilterButton onClick={onFiltersClick}>
// 								<FilterIcon />
// 								<FiltersButtonLabel>
// 									{/* {t('common:filters-label')} */}
// 									Filters
// 									</FiltersButtonLabel>
// 							</FilterButton>
// 						</FiltersButtonContainer>
// 						{/* <SortSelectContainer /> */}

// 						<GridSwitchContainer>
// 							<GridSwitch
// 								onChange={e => setGridType(e.target.checked)}
// 								checked={gridType}
// 							/>
// 						</GridSwitchContainer>
// 					</FiltersSection>
// 					<ListingsNFTsContainer>
// 						{filtersExpanded && (
// 							<DesktopFiltersSection>
// 								<Box>
// 									<Accordion
// 										icon={<TargetIcon />}
// 										title={
// 											<AccordionTitle>
// 												{/* {t('trade-listings:filters:status-label')} */}
// 												Status
// 											</AccordionTitle>
// 										}
// 									>
// 										<AccordionContentWrapper>
// 											<MultiSelectAccordionInput
// 												value={statuses}
// 												onChange={v => setStatuses(v)}
// 												accordionTitle="Status" //{t('trade-listings:filters:status-label')}
// 												options={statusOptions}
// 											/>
// 										</AccordionContentWrapper>
// 									</Accordion>
// 								</Box>
// 								<Box>
// 									<Accordion
// 										icon={<CollectionsBoxesIcon />}
// 										title={
// 											<AccordionTitle>
// 												{/* {t('trade-listings:filters:collections-label')} */}
// 												Collections
// 											</AccordionTitle>
// 										}
// 									>
// 										<AccordionContentWrapper>
// 											<MultiSelectAccordionInput
// 												value={collections}
// 												onChange={v => setCollections(v)}
// 												accordionTitle="NFT Collection"
// 												// {t(
// 												// 	'trade-listings:filters:nft-collections-search-label'
// 												// )}
// 												options={(verifiedCollections ?? [])?.map(
// 													({ collectionAddress, collectionName }) => ({
// 														label: collectionName,
// 														value: collectionAddress,
// 													})
// 												)}
// 												placeholder="Search collections"
// 												// {t(
// 												// 	'trade-listings:filters:search-collections-placeholder'
// 												// )}
// 											/>
// 										</AccordionContentWrapper>
// 									</Accordion>
// 								</Box>

// 								<Box>
// 									<Accordion
// 										icon={<LookingForCompassIcon />}
// 										title={
// 											<AccordionTitle>
// 												{/* {t('trade-listings:filters:looking-for-label')} */}
// 											Looking for
// 											</AccordionTitle>
// 										}
// 									>
// 										<AccordionContentWrapper>
// 											<MultiSelectAccordionInput
// 												value={lookingForCollections}
// 												onChange={v => setLookingForCollections(v)}
// 												accordionTitle="NFT Collection"
// 												// {t(
// 												// 	'trade-listings:filters:nft-collections-search-label'
// 												// )}
// 												options={(verifiedCollections ?? [])?.map(
// 													({ collectionAddress, collectionName }) => ({
// 														label: collectionName,
// 														value: collectionAddress,
// 													})
// 												)}
// 												placeholder="Search Collections"
// 												// {t(
// 												// 	'trade-listings:filters:search-collections-placeholder'
// 												// )}
// 											/>
// 										</AccordionContentWrapper>
// 									</Accordion>
// 								</Box>
// 								<Box mb='8px'>
// 									<CheckboxCard
// 										variant='medium'
// 										title="My favorites" //{t('trade-listings:filters:my-favorites-label')}
// 										onChange={e => setMyFavoritesChecked(e.target.checked)}
// 										checked={myFavoritesChecked}
// 									/>
// 								</Box>
// 								<Box mb='8px'>
// 									<CheckboxCard
// 										variant='medium'
// 										title="Countered by me" // {t('trade-listings:filters:countered-by-me-label')}
// 										onChange={e => setCounteredByMeChecked(e.target.checked)}
// 										checked={counteredByMeChecked}
// 									/>
// 								</Box>
// 								<Box mb='8px'>
// 									<CheckboxCard
// 										variant='medium'
// 										title="Looking for liquid assets" // {t('trade-listings:filters:looking-for-liquid-assets-label')}
// 										onChange={e => setLookingForLiquidAssetsChecked(e.target.checked)}
// 										checked={lookingForLiquidAssetsChecked}
// 									/>
// 								</Box>
// 							</DesktopFiltersSection>
// 						)}
// 						<Box sx={{ width: '100%' }}>
// 							<TradeGridController
// 								trades={infiniteData}
// 								isLoading={!infiniteData.length && isLoading}
// 								verifiedCollections={verifiedCollections}
// 								gridType={Number(gridType)}
// 								favoriteTrades={favoriteTrades}
// 							/>
// 							<Flex sx={{ width: '100%', marginTop: '14px' }}>
// 								{trades?.data && !!trades.data?.length && !isLoading && (
// 									<Button
// 										disabled={trades?.page === trades.pageCount}
// 										fullWidth
// 										variant='dark'
// 										onClick={() => setPage(prev => prev + 1)}
// 									>
// 										{/* {t('common:show-more')} */}
// 										Show More
// 									</Button>
// 								)}
// 							</Flex>
// 						</Box>
// 					</ListingsNFTsContainer>
// 				</Box>
// 			</LayoutContainer>
// 		</Page>
// 	)
// }
