// import NiceModal from '@ebay/nice-modal-react'
// import EmptyBox from '@/assets/images/EmptyBox'
// import { LinkButton } from '@/components/link'
// import React from 'react'
// import { Box, Flex } from 'theme-ui'
// import * as ROUTES from '@/constants/routes'

// import {
// 	Accordion,
// 	AccordionTitle,
// 	Button,
// 	Loader,
// 	MultiSelectAccordionInput,
// 	Pagination,
// } from '@/components/ui'
// import { CollectionsBoxesIcon, TargetIcon } from '@/assets/icons/mixed'
// import { NFT } from '@/services/api/walletNFTsService'
// import { TradesResponse } from '@/services/api/tradesService'
// // import { useTranslation } from 'next-i18next'
// import { VERIFIED_COLLECTIONS } from '@/constants/useQueryKeys'
// // import { WalletStatus, useWallet } from '@terra-money/wallet-kit'
// import { SupportedCollectionsService } from '@/services/api'
// import { useQuery } from '@tanstack/react-query'
// import { MultiSelectAccordionInputOption } from '@/components/ui/multi-select-accordion-input/MultiSelectAccordionInput'
// import { CHAIN_NAME, getNetworkName } from '@/utils/blockchain/networkUtils'
// import { ConnectWalletModal } from '@/components/shared/modals/connect-wallet-modal/ConnectWalletModal'
// import TradeOfferCard from './TradeOfferCard'
// import {
// 	AccordionContentWrapper,
// 	ActivityCard,
// 	ActivityCardEmptyContainer,
// 	ActivityCardEmptyTitle,
// 	ActivityLoadingContainer,
// 	SectionTitle,
// } from './styled'
// import { useChain } from '@cosmos-kit/react'

// interface TradeOffersProps {
// 	allTrades?: TradesResponse
// 	refetch: () => void
// 	isLoading: boolean
// 	trades?: TradesResponse
// 	page: number
// 	setPage: React.Dispatch<React.SetStateAction<number>>
// 	statuses: MultiSelectAccordionInputOption[]
// 	setStatuses: React.Dispatch<
// 		React.SetStateAction<MultiSelectAccordionInputOption[]>
// 	>
// 	collections: MultiSelectAccordionInputOption[]
// 	setCollections: React.Dispatch<
// 		React.SetStateAction<MultiSelectAccordionInputOption[]>
// 	>
// 	statusOptions: MultiSelectAccordionInputOption[]
// 	tradesFetched: boolean
// }

// function TradeOffers({
// 	isLoading,
// 	allTrades,
// 	tradesFetched,
// 	refetch,
// 	page,
// 	setPage,
// 	trades,
// 	statuses,
// 	setStatuses,
// 	collections,
// 	setCollections,
// 	statusOptions,
// }: TradeOffersProps) {
// // 	const { t } = useTranslation()
// 	const networkName = getNetworkName()
// 	// const wallet = useWallet()
// 	const {chain, status} = useChain(CHAIN_NAME)

// 	const { data: verifiedCollections } = useQuery(
// 		[VERIFIED_COLLECTIONS, networkName],
// 		async () => SupportedCollectionsService.getSupportedCollections(networkName),
// 		{
// 			retry: true,
// 		}
// 	)

// 	const connectWallet = () => {
// 		NiceModal.show(ConnectWalletModal)
// 	}

// 	return (
// 		<Flex sx={{ flexDirection: 'column', gap: '24px', pb: '48px' }}>
// 			<SectionTitle>
// 				{/* {t('dashboard:trades:title')} */}
// 				Trades
// 				</SectionTitle>

// 			{!allTrades?.total && tradesFetched ? (
// 				<ActivityCard>
// 					<ActivityCardEmptyContainer>
// 						<EmptyBox />

// 						<Box sx={{ maxWidth: '524px' }}>
// 							<ActivityCardEmptyTitle>
// 								{/* {t('dashboard:trades:no-offers')} */}
// 								You don&apos;t have any offers yet.
// 								<br />
// 								{/* {t('dashboard:trades:make-offer-to-appear')} */}
// 								Make an offer on a trade for it to appear here.
// 							</ActivityCardEmptyTitle>
// 						</Box>

// 						{status === 'Disconnected' ? (
// 							<Button onClick={connectWallet} variant='gradient' size='large'>
// 								{/* {t('common:connect-wallet')} */}
// 								Connect Wallet
// 							</Button>
// 						) : (
// 							<LinkButton href={ROUTES.TRADE_LISTINGS} variant='gradient' size='large'>
// 								{/* {t('dashboard:trades:explore-listings')} */}
// 								Explore Trade Listings
// 							</LinkButton>
// 						)}
// 					</ActivityCardEmptyContainer>
// 				</ActivityCard>
// 			) : (
// 				<Flex
// 					sx={{
// 						flexDirection: ['column'],
// 						alignItems: 'center',
// 						minHeight: '960px',
// 						pb: ['47px'],
// 					}}
// 				>
// 					<Flex
// 						sx={{
// 							flex: [null, null, 1],
// 							width: '100%',
// 							flexDirection: ['column', 'column', 'row'],
// 							gap: ['12px', '12px', '24px'],
// 						}}
// 					>
// 						<Flex
// 							sx={{
// 								flex: 1,
// 								flexDirection: ['column', 'row', 'column'],
// 								maxWidth: [null, null, '308px'],
// 								gap: [null, '8px', null],
// 							}}
// 						>
// 							<Box sx={{ flex: [null, 1, 'unset'] }}>
// 								<Accordion
// 									icon={<TargetIcon />}
// 									title={
// 										<AccordionTitle>
// 											{/* {t('dashboard:trades:filters:status-label')} */}
// 											Status
// 										</AccordionTitle>
// 									}
// 								>
// 									<AccordionContentWrapper>
// 										<MultiSelectAccordionInput
// 											value={statuses}
// 											onChange={v => setStatuses(v)}
// 											accordionTitle="Status" //{t('dashboard:trades:filters:status-label')}
// 											options={statusOptions}
// 										/>
// 									</AccordionContentWrapper>
// 								</Accordion>
// 							</Box>
// 							<Box sx={{ flex: [null, 1, 'unset'] }}>
// 								<Accordion
// 									icon={<CollectionsBoxesIcon />}
// 									title={
// 										<AccordionTitle>
// 											{/* {t('dashboard:trades:filters:collections-label')} */}
// 											Collections
// 										</AccordionTitle>
// 									}
// 								>
// 									<AccordionContentWrapper>
// 										<MultiSelectAccordionInput
// 											value={collections}
// 											onChange={v => setCollections(v)}
// 											accordionTitle="NFT Collection"
// 											// {t(
// 											// 	'dashboard:trades:filters:nft-collections-search-label'
// 											// )}
// 											options={(verifiedCollections ?? [])?.map(
// 												({ collectionAddress, collectionName }) => ({
// 													label: collectionName,
// 													value: collectionAddress,
// 												})
// 											)}
// 											placeholder="Search collections..."
// 											// {t(
// 											// 	'dashboard:trades:filters:search-collections-placeholder'
// 											// )}
// 										/>
// 									</AccordionContentWrapper>
// 								</Accordion>
// 							</Box>
// 						</Flex>

// 						<Flex
// 							sx={{
// 								flexDirection: 'column',
// 								flex: 1,
// 								justifyContent: 'flex-start',
// 								alignItems: 'center',
// 							}}
// 						>
// 							<Box
// 								sx={{
// 									display: 'grid',
// 									width: ['100%'],
// 									overflow: 'auto',
// 									gridTemplateColumns: '1fr',
// 									gridColumnGap: ['16px', '25px', '14px'],
// 									gridRowGap: ['8px', '16px', '18px'],
// 								}}
// 							>
// 								{isLoading && (
// 									<ActivityLoadingContainer>
// 										<Loader />
// 									</ActivityLoadingContainer>
// 								)}
// 								{!isLoading &&
// 									(trades?.data ?? []).map(trade => {
// 										const {
// 											tradeId,
// 											tradeInfo: {
// 												additionalInfo,
// 												associatedAssets,
// 												whitelistedUsers,
// 												state,
// 											},
// 										} = trade
// 										return (
// 											<Box key={tradeId}>
// 												<TradeOfferCard
// 													refetchTrade={refetch}
// 													trade={trade}
// 													state={state}
// 													description={
// 														additionalInfo?.tradePreview?.cw721Coin?.description ?? ''
// 													}
// 													attributes={
// 														additionalInfo?.tradePreview?.cw721Coin?.attributes ?? []
// 													}
// 													tokenId={additionalInfo?.tradePreview?.cw721Coin?.tokenId ?? ''}
// 													collectionAddress={
// 														additionalInfo?.tradePreview?.cw721Coin?.collectionAddress ?? ''
// 													}
// 													href={`${ROUTES.TRADE_LISTING_DETAILS}?tradeId=${tradeId}`}
// 													nfts={(associatedAssets || [])
// 														.filter(nft => nft.cw721Coin)
// 														.map(({ cw721Coin }) => cw721Coin as NFT)}
// 													lookingFor={additionalInfo?.lookingFor ?? []}
// 													imageUrl={additionalInfo?.tradePreview?.cw721Coin?.imageUrl ?? []}
// 													name={additionalInfo?.tradePreview?.cw721Coin?.name ?? ''}
// 													verified={(verifiedCollections ?? []).some(
// 														({ collectionAddress }) =>
// 															additionalInfo?.tradePreview?.cw721Coin?.collectionAddress ===
// 															collectionAddress
// 													)}
// 													isPrivate={(whitelistedUsers || []).length > 0}
// 													collectionName={
// 														additionalInfo?.tradePreview?.cw721Coin?.collectionName || ''
// 													}
// 													hasLookingFor
// 												/>
// 											</Box>
// 										)
// 									})}
// 							</Box>
// 							<Box sx={{ mt: 'auto', pt: '24px' }}>
// 								<Pagination
// 									currentPage={page}
// 									pageCount={trades?.pageCount}
// 									setPage={setPage}
// 								/>
// 							</Box>
// 						</Flex>
// 					</Flex>
// 				</Flex>
// 			)}
// 		</Flex>
// 	)
// }

// TradeOffers.defaultProps = {
// 	allTrades: undefined,
// 	trades: undefined,
// }

// export default TradeOffers
