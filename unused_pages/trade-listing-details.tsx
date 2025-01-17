// import React from 'react'
// // import { useTranslation } from 'next-i18next'
// import NiceModal from '@ebay/nice-modal-react'
// import { Box, Flex } from 'theme-ui'
// import moment from 'moment'
// import { first, sample } from 'lodash'
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { useRouter } from 'next/router'

// import {
// 	AttributeCard,
// 	BlueWarning,
// 	Button,
// 	DescriptionCard,
// 	DescriptionCardItem,
// 	Loader,
// } from '../components/ui'

// // import { makeStaticPaths, makeStaticProps } from 'lib'

// import {
// 	Row,
// 	TradeHeaderActionsRow,
// 	CounterOffersTable,
// 	TradeListingsYouMightLike,
// 	CounterOffersTableTitle,
// 	OwnerName,
// 	OwnerAvatarImg,
// } from '../components/trade-listing-details'

// import { AvatarIcon, CalendarIcon, WalletIcon } from '../assets/icons/mixed'
// import useHeaderActions from '../hooks/useHeaderActions'
// import * as ROUTES from '../constants/routes'
// import { TradesService, TRADE_STATE } from '../services/api/tradesService'
// import { NFT } from '../services/api/walletNFTsService'
// import { CounterTradesService, SupportedCollectionsService } from '../services/api'
// import { asyncAction } from '../utils/js/asyncAction'

// import useAddress from '../hooks/useAddress'
// import NFTPreviewImages from '../components/shared/nft-preview-images/NFTPreviewImages'
// import TradeIcon from '../assets/icons/mixed/components/TradeIcon'
// import {
// 	ACCEPTED_COUNTER_TRADE,
// 	FAVORITES_TRADES,
// 	TRADE,
// 	VERIFIED_COLLECTIONS,
// } from '../constants/useQueryKeys'
// import { CounterTrade } from '../services/api/counterTradesService'
// import { Coin, Cw1155Coin } from '../types'
// import { FavoriteTradesService } from '../services/api/favoriteTradesService'
// import { LookingFor } from '../components/shared/trade/looking-for'
// import { P2PTradingContract } from '../services/blockchain'
// import useNameService from '../hooks/useNameService'
// import { fromIPFSImageURLtoImageURL } from '../utils/blockchain/ipfs'
// import {
// 	TxBroadcastingModal,
// 	ViewNFTsModal,
// 	ViewNFTsModalProps,
// 	ViewNFTsModalResult,
// } from '../components/shared'
// import { LayoutContainer, Page } from '../components/layout'
// import { DescriptionRow, ImageRow } from '../components/shared/trade'
// import { LinkButton } from '../components/link'
// import { CreateTradeListing } from '../components/shared/header-actions/create-trade-listing'
// import { getNetworkName } from '../utils/blockchain/networkUtils'

// // const getStaticProps = makeStaticProps(['common', 'trade-listings'])
// // const getStaticPaths = makeStaticPaths()

// // export { getStaticPaths, getStaticProps }

// export default function ListingDetails() {
// 	useHeaderActions(<CreateTradeListing />)

// 	// const { t } = useTranslation(['common', 'trade-listings'])

// 	const route = useRouter()

// 	const networkName = getNetworkName()

// 	const myAddress = useAddress()

// 	const queryClient = useQueryClient()

// 	const { tradeId } = route.query ?? {}

// 	const updateFavoriteTradeState = data =>
// 		queryClient.setQueryData(
// 			[FAVORITES_TRADES, networkName, myAddress],
// 			(old: any) => [...old.filter(o => o.id !== data.id), data]
// 		)

// 	const { mutate: addFavoriteTrade } = useMutation(
// 		FavoriteTradesService.addFavoriteTrade,
// 		{
// 			onSuccess: updateFavoriteTradeState,
// 		}
// 	)

// 	const { mutate: removeFavoriteTrade } = useMutation(
// 		FavoriteTradesService.removeFavoriteTrade,
// 		{
// 			onSuccess: updateFavoriteTradeState,
// 		}
// 	)

// 	const { data: verifiedCollections } = useQuery(
// 		[VERIFIED_COLLECTIONS, networkName],
// 		async () => SupportedCollectionsService.getSupportedCollections(networkName),
// 		{
// 			retry: true,
// 		}
// 	)

// 	const {
// 		data: trade,
// 		isLoading,
// 		refetch,
// 	} = useQuery(
// 		[TRADE, tradeId, networkName],
// 		async () => TradesService.getTrade(networkName, tradeId as string),
// 		{
// 			retry: true,
// 		}
// 	)

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

// 	const { data: acceptedCounterTrades } = useQuery(
// 		[ACCEPTED_COUNTER_TRADE, tradeId, networkName, myAddress],
// 		async () =>
// 			CounterTradesService.getAllCounterTrades(
// 				networkName,
// 				{
// 					owners: [myAddress],
// 					tradeIds: [`${tradeId}`],
// 					states: [TRADE_STATE.Accepted],
// 				},
// 				{
// 					limit: 1,
// 					page: 1,
// 				}
// 			),
// 		{
// 			retry: true,
// 		}
// 	)

// 	const [ownerInfo] = useNameService(
// 		trade?.tradeInfo?.owner ? [trade?.tradeInfo?.owner] : []
// 	)

// 	const ownerName =
// 		ownerInfo?.extension?.publicName ?? ownerInfo?.extension?.name

// 	const [acceptedCounterTrade] = acceptedCounterTrades?.data ?? []

// 	const { tradeInfo } = trade ?? {}
// 	const { additionalInfo, whitelistedUsers } = tradeInfo ?? {}

// 	const [tradePreview, setTradePreview] = React.useState<{
// 		coin?: Coin
// 		cw721Coin?: NFT
// 		cw1155Coin?: Cw1155Coin
// 	} | null>(null)

// 	React.useEffect(() => {
// 		if (trade) {
// 			setTradePreview(additionalInfo?.tradePreview ?? null)
// 		}
// 	}, [trade])

// 	const countererWithdrawAccepted = async (counterTrade: CounterTrade) => {
// 		await NiceModal.show(TxBroadcastingModal, {
// 			transactionAction: P2PTradingContract.withdrawPendingAssets(
// 				counterTrade.trade.tradeId
// 			),
// 			closeOnFinish: true,
// 		})

// 		refetch()

// 		await CounterTradesService.getCounterTrade(
// 			networkName,
// 			counterTrade.trade.tradeId,
// 			counterTrade.counterId
// 		)
// 	}

// 	const handleViewAllNFTs = async () => {
// 		if (!trade) {
// 			return
// 		}
// 		const [, result] = await asyncAction<ViewNFTsModalResult>(
// 			NiceModal.show(ViewNFTsModal, {
// 				nfts: (trade?.tradeInfo.associatedAssets ?? [])
// 					.filter(({ cw721Coin }) => cw721Coin)
// 					.map(({ cw721Coin }) => cw721Coin),
// 				title: 'All NFTs', //t('common:all-nfts'),
// 			} as ViewNFTsModalProps)
// 		)

// 		if (result) {
// 			setTradePreview(oldPrev => ({ ...oldPrev, cw721Coin: result.nft }))
// 		}
// 	}

// 	const isMyTrade = trade?.tradeInfo?.owner === myAddress

// 	const liked = Boolean(
// 		(favoriteTrades ?? []).find(
// 			favoriteTrade =>
// 				favoriteTrade.trades.some(fTrade => fTrade.tradeId === Number(tradeId)) &&
// 				favoriteTrade.user === myAddress
// 		)
// 	)

// 	const toggleLike = () =>
// 		({ addFavoriteTrade, removeFavoriteTrade }[
// 			liked ? 'removeFavoriteTrade' : 'addFavoriteTrade'
// 		]({
// 			network: networkName,
// 			tradeId: [Number(tradeId)],
// 			user: myAddress,
// 		}))

// 	return (
// 		<Page title="Title"// {t('title')}
// 		>
// 			<LayoutContainer>
// 				{!isLoading ? (
// 					<>
// 						<TradeHeaderActionsRow trade={trade} />
// 						<Row>
// 							{[TRADE_STATE.Cancelled, TRADE_STATE.Accepted].includes(
// 								tradeInfo?.state as TRADE_STATE
// 							) && (
// 								<BlueWarning sx={{ width: '100%', height: '49px' }}>
// 									{/* {t('trade-listings:item-not-available')} */}
// 									This item is no longer available
// 								</BlueWarning>
// 							)}
// 						</Row>

// 						<Flex
// 							sx={{ flexDirection: ['column', 'column', 'row'], gap: [0, 0, '32px'] }}
// 						>
// 							<Box sx={{ flex: [1, 1, 'unset'], width: ['unset', 'unset', '491px'] }}>
// 								<ImageRow
// 									nft={tradePreview?.cw721Coin}
// 									imageUrl={tradePreview?.cw721Coin?.imageUrl ?? []}
// 									onLike={toggleLike}
// 									liked={liked}
// 								/>

// 								<Row>
// 									<Button fullWidth variant='dark' onClick={handleViewAllNFTs}>
// 										<Flex sx={{ alignItems: 'center' }}>
// 											<NFTPreviewImages
// 												nfts={(tradeInfo?.associatedAssets ?? [])
// 													.filter(asset => asset.cw721Coin)
// 													.map(({ cw721Coin }) => cw721Coin as NFT)}
// 											/>
// 											<div>
// 												{/* {t('trade-listings:view-all-nfts')} */}
// 												View all NFTs
// 												</div>
												
// 										</Flex>
// 									</Button>
// 								</Row>
// 							</Box>
// 							<Box sx={{ flex: 1 }}>
// 								<Row>
// 									<DescriptionRow
// 										name={tradePreview?.cw721Coin?.name}
// 										isPrivate={(whitelistedUsers ?? []).length > 0}
// 										collectionName={tradePreview?.cw721Coin?.collectionName ?? ''}
// 										verified={(verifiedCollections ?? []).some(
// 											({ collectionAddress }) =>
// 												tradePreview?.cw721Coin?.collectionAddress === collectionAddress
// 										)}
// 									/>
// 								</Row>
// 								{Boolean(tradePreview?.cw721Coin?.attributes?.length) && (
// 									<Row>
// 										<Flex sx={{ flexWrap: 'wrap', gap: '4.3px' }}>
// 											{(tradePreview?.cw721Coin?.attributes ?? []).map(attribute => (
// 												<AttributeCard
// 													key={JSON.stringify(attribute)}
// 													name={attribute.traitType}
// 													value={attribute.value}
// 												/>
// 											))}
// 										</Flex>
// 									</Row>
// 								)}
// 								<Row>
// 									<DescriptionCard>
// 										<DescriptionCardItem>
// 											<Flex sx={{ alignItems: 'center' }}>
// 												<Box
// 													sx={{
// 														width: '24px',
// 														height: '24px',
// 														borderRadius: '4px',
// 														overflow: 'hidden',
// 													}}
// 												>
// 													{ownerInfo?.extension?.image ? (
// 														<OwnerAvatarImg
// 															src={fromIPFSImageURLtoImageURL(ownerInfo?.extension?.image)}
// 														/>
// 													) : (
// 														<AvatarIcon width='100%' height='100%' />
// 													)}
// 												</Box>
// 												{ownerName && (
// 													<Box sx={{ ml: '4px' }}>
// 														<OwnerName>{ownerName}</OwnerName>
// 													</Box>
// 												)}
// 												<Box sx={{ ml: '4px', flex: 1 }}>
// 													{`''${tradeInfo?.additionalInfo?.ownerComment?.comment ?? ''}''`}
// 												</Box>
// 											</Flex>
// 										</DescriptionCardItem>
// 										<DescriptionCardItem>
// 											<WalletIcon width='20px' height='20px' color='#fff' />
// 											<Box
// 												sx={{
// 													ml: '9px',
// 													flex: 1,
// 												}}
// 											>
// 												{tradeInfo?.owner ?? ''}
// 											</Box>
// 										</DescriptionCardItem>
// 										<DescriptionCardItem>
// 											<CalendarIcon width='20px' height='20px' color='#fff' />
// 											<Box
// 												sx={{
// 													ml: '9px',
// 													flex: 1,
// 												}}
// 											>
// 												{/* {t(`trade-listings:listed`, {
// 													listed: moment(tradeInfo?.additionalInfo?.time ?? '').fromNow(),
// 												})} */}
// 											{moment(tradeInfo?.additionalInfo?.time ?? '').fromNow()}
// 											</Box>
// 										</DescriptionCardItem>
// 										{whitelistedUsers && (whitelistedUsers ?? []).length > 0 && (
// 											<DescriptionCardItem>
// 												<TradeIcon width='20px' height='20px' color='#fff' />
// 												<Box
// 													sx={{
// 														ml: '9px',
// 														flex: 1,
// 													}}
// 												>
// 													{first(whitelistedUsers) ?? ''}
// 												</Box>
// 											</DescriptionCardItem>
// 										)}
// 									</DescriptionCard>
// 								</Row>
// 								{Boolean((additionalInfo?.lookingFor ?? []).length) && (
// 									<Row>
// 										<LookingFor secondary lookingFor={additionalInfo?.lookingFor ?? []} />
// 									</Row>
// 								)}

// 								{!isMyTrade &&
// 									trade &&
// 									[TRADE_STATE.Published, TRADE_STATE.Countered].includes(
// 										tradeInfo?.state as TRADE_STATE
// 									) && (
// 										<Row>
// 											<LinkButton
// 												size='extraLarge'
// 												href={`${ROUTES.TRADE_CREATE_COUNTER_LISTING}?tradeId=${tradeId}`}
// 												fullWidth
// 												variant='gradient'
// 											>
// 												<div>
// 													{/* {t('trade-listings:make-offer')} */}
// 													Make offer
// 													</div>
											
// 											</LinkButton>
// 										</Row>
// 									)}

// 								{/* Case when counterer withdraws my trade, after accepting. */}
// 								{tradeInfo &&
// 									!isMyTrade &&
// 									[TRADE_STATE.Accepted].includes(tradeInfo?.state) &&
// 									acceptedCounterTrade &&
// 									!tradeInfo?.assetsWithdrawn && (
// 										<Row>
// 											<Button
// 												size='extraLarge'
// 												fullWidth
// 												variant='gradient'
// 												onClick={async () =>
// 													countererWithdrawAccepted(acceptedCounterTrade)
// 												}
// 											>
// 												{/* {t('common:withdraw')} */}
// 												Withdraw
// 											</Button>
// 										</Row>
// 									)}
// 							</Box>
// 						</Flex>

// 						<Row>
// 							<Flex sx={{ flex: 1, flexDirection: 'column' }}>
// 								<Box sx={{ padding: '8px 0' }}>
// 									<CounterOffersTableTitle>
// 										{/* {t('trade-listings:counter-offers.title')} */}

// 										Counter Offers
// 									</CounterOffersTableTitle>
// 								</Box>
// 								<CounterOffersTable trade={trade} refetchTrade={refetch} />
// 							</Flex>
// 						</Row>
// 						<TradeListingsYouMightLike
// 							search={
// 								tradePreview?.cw721Coin?.collectionName ??
// 								sample(verifiedCollections ?? [])?.collectionName ??
// 								''
// 							}
// 							tradeId={trade?.tradeId}
// 						/>
// 					</>
// 				) : (
// 					<Flex
// 						sx={{ height: '100vh', alignItems: 'center', justifyContent: 'center' }}
// 					>
// 						<Loader />
// 					</Flex>
// 				)}
// 			</LayoutContainer>
// 		</Page>
// 	)
// }
