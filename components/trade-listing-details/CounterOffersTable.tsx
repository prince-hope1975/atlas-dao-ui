import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import ImagePlaceholder from '@/assets/images/ImagePlaceholder'
import NiceModal from '@ebay/nice-modal-react'
import {
	Table,
	TableHead,
	TableHeadRow,
	TableHeadRowCell,
	TableBody,
	TableBodyRow,
	TableBodyRowCell,
	Button,
	OverflowTip,
} from '@/components/ui'
import moment from 'moment'
// import { useTranslation } from 'next-i18next'
import React from 'react'
import {
	CounterTrade,
	CounterTradesService,
} from '@/services/api/counterTradesService'
import { Trade, TRADE_STATE } from '@/services/api/tradesService'
import { NFT } from '@/services/api/walletNFTsService'
import { Box, Flex } from 'theme-ui'

import {
	AcceptCounterOfferModal,
	DenyCounterOfferSuccessModal,
	DenyCounterOfferModal,
	AcceptCounterOfferModalProps,
	AcceptCounterOfferModalResult,
	DenyCounterOfferModalProps,
	DenyCounterOfferModalResult,
	DenySuccessModalProps,
	OfferAcceptedModal,
} from '@/components/trade-listing-details/modals'
import { asyncAction } from '@/utils/js/asyncAction'
import { TxBroadcastingModal } from '@/components/shared'
import useAddress from '@/hooks/useAddress'
import { COUNTER_TRADES } from '@/constants/useQueryKeys'
import { AvatarIcon, StarIcon } from '@/assets/icons/mixed'
import { isNil } from 'lodash'
import { P2PTradingContract } from '@/services/blockchain'
import { HumanCoin } from 'types'
import { fromIPFSImageURLtoImageURL } from '@/utils/blockchain/ipfs'
import useNameService from '@/hooks/useNameService'
import { getNetworkName } from '@/utils/blockchain/networkUtils'
import {
	NameLabel,
	NameServiceImage,
	NameServiceImagePlaceholder,
	PreviewImage,
	PreviewImageContainer,
	PreviewNFTsSection,
	TokenChip,
} from './styled'
import {
	ViewCounterOfferModal,
	ViewCounterOfferModalProps,
} from './modals/view-counter-offer-modal'
import WithdrawCancelledCounterModal from './modals/withdraw-cancelled-counter-modal/WithdrawCancelledCounterModal'

const Container = styled(Flex)`
	flex-direction: column;
	padding-bottom: 45px;
	width: 100%;
`

interface CounterOffersTableProps {
	trade?: Trade
	refetchTrade: () => void
	excludeTopBorder?: boolean
}
function CounterOffersTable({
	excludeTopBorder,
	trade,
	refetchTrade,
}: CounterOffersTableProps) {
	const previewItemsLimit = 5

	const [page, setPage] = React.useState(1)

	const { tradeId, tradeInfo } = trade ?? {}

	const networkName = getNetworkName()

	// TODO extract this into hook, along with useQuery part.
	const [infiniteData, setInfiniteData] = React.useState<CounterTrade[]>([])

	React.useEffect(() => {
		setInfiniteData([])
		setPage(1)
	}, [networkName, tradeId])

	const { data: counterTrades, isLoading } = useQuery(
		[COUNTER_TRADES, networkName, page, tradeId],
		async () =>
			CounterTradesService.getAllCounterTrades(
				networkName,
				{
					tradeIds: [`${tradeId}`],
				},
				{
					limit: 20,
					page,
				}
			),
		{
			enabled: !isNil(tradeId),
			retry: true,
		}
	)

	React.useEffect(
		() =>
			counterTrades && setInfiniteData(prev => [...prev, ...counterTrades.data]),
		[counterTrades]
	)

	const updateCounterTrade = async (counterTrade: CounterTrade) => {
		refetchTrade()

		const updatedCounter = await CounterTradesService.getCounterTrade(
			networkName,
			counterTrade.trade.tradeId,
			counterTrade.counterId
		)

		setInfiniteData(
			infiniteData.map(counter =>
				counter.id === updatedCounter.id ? updatedCounter : counter
			)
		)
	}

	const handleApprove = async (counterTrade: CounterTrade) => {
		const fees = await P2PTradingContract.getAcceptedTradeFee({
			counterId: counterTrade.counterId,
			tradeId: counterTrade.trade.tradeId,
		})

		const [, result] = await asyncAction<AcceptCounterOfferModalResult>(
			NiceModal.show(AcceptCounterOfferModal, {
				counterTrade,
				trade,
				fees,
			} as AcceptCounterOfferModalProps)
		)

		if (result) {
			await NiceModal.show(TxBroadcastingModal, {
				transactionAction: P2PTradingContract.acceptTrade(
					counterTrade.counterId,
					counterTrade.trade.tradeId,
					result.comment,
					true
				),
				closeOnFinish: true,
			})

			await Promise.all([
				updateCounterTrade(counterTrade),
				NiceModal.show(OfferAcceptedModal, {
					counterTrade,
					trade,
				}),
			])
		}
	}

	const withdrawCounterTrade = async (counterTrade: CounterTrade) => {
		if (counterTrade?.tradeInfo?.state.includes(TRADE_STATE.Refused)) {
			const [, result] = await asyncAction(
				NiceModal.show(WithdrawCancelledCounterModal, {
					trade,
					counterTrade,
				})
			)

			if (result) {
				await NiceModal.show(TxBroadcastingModal, {
					transactionAction: P2PTradingContract.withdrawAllFromCounter(
						counterTrade.trade.tradeId,
						counterTrade.counterId
					),
					closeOnFinish: true,
				})

				await updateCounterTrade(counterTrade)
				return
			}
		}

		await NiceModal.show(TxBroadcastingModal, {
			transactionAction: P2PTradingContract.withdrawAllFromCounter(
				counterTrade.trade.tradeId,
				counterTrade.counterId
			),
			closeOnFinish: true,
		})

		await updateCounterTrade(counterTrade)
	}

	const cancelCounterTrade = async (counterTrade: CounterTrade) => {
		await NiceModal.show(TxBroadcastingModal, {
			transactionAction: P2PTradingContract.cancelCounterTradeAndWithdraw(
				counterTrade.counterId,
				counterTrade.trade.tradeId
			),
			closeOnFinish: true,
		})

		await updateCounterTrade(counterTrade)
	}

	const handleDeny = async (counterTrade: CounterTrade) => {
		const [, result] = await asyncAction<DenyCounterOfferModalResult>(
			NiceModal.show(DenyCounterOfferModal, {
				counterTrade,
			} as DenyCounterOfferModalProps)
		)

		if (result) {
			await NiceModal.show(TxBroadcastingModal, {
				transactionAction: P2PTradingContract.refuseCounterTrade(
					counterTrade.trade.tradeId,
					counterTrade.counterId,
					result.comment
				),
				closeOnFinish: true,
			})

			await Promise.all([
				updateCounterTrade(counterTrade),
				NiceModal.show(DenyCounterOfferSuccessModal, {
					counterTrade,
				} as DenySuccessModalProps),
			])
		}
	}

	const withdrawAccepted = async (counterTrade: CounterTrade) => {
		await NiceModal.show(TxBroadcastingModal, {
			transactionAction: P2PTradingContract.withdrawAcceptedTrade(
				counterTrade.trade.tradeId
			),
			closeOnFinish: true,
		})

		await updateCounterTrade(counterTrade)
	}

	const confirmCounter = async (counterTrade: CounterTrade) => {
		await NiceModal.show(TxBroadcastingModal, {
			transactionAction: P2PTradingContract.confirmCounterTrade(
				counterTrade?.counterId,
				counterTrade.trade.tradeId
			),
			closeOnFinish: true,
		})

		await updateCounterTrade(counterTrade)
	}

	// const { t } = useTranslation(['common', 'trade-listings'])
	// const columns: Array<string> = t(
	// 	'trade-listings:counter-offers.table.columns',
	// 	{
	// 		returnObjects: true,
	// 	}
	// )
	const columns: Array<string> = ["User", "NFTs", "Tokens", "Status", "Date"]

	const myAddress = useAddress()
	const isMyTrade = trade?.tradeInfo?.owner === myAddress

	const nameServiceResolutions = useNameService(
		infiniteData.map(counterTrade => counterTrade?.tradeInfo?.owner ?? '')
	)

	const viewCounterTrade = async (counterTrade: CounterTrade) => {
		await NiceModal.show(ViewCounterOfferModal, {
			counterTrade,
			// title: t('trade-listings:view-counter-offer-modal.title'),
			title: 'Counter Offer'
		} as ViewCounterOfferModalProps)
	}

	return (
		<Container>
			<Table
				style={
					excludeTopBorder ? { borderTopRightRadius: 0, borderTopLeftRadius: 0 } : {}
				}
			>
				<TableHead>
					<TableHeadRow>
						{columns.map(col => (
							<TableHeadRowCell key={col}>{col}</TableHeadRowCell>
						))}
						<TableHeadRowCell />
					</TableHeadRow>
				</TableHead>
				<TableBody>
					{infiniteData.map((counterTrade, index) => {
						const isMyCounterTrade = counterTrade?.tradeInfo?.owner === myAddress

						const { id, tradeInfo: counterTradeInfo } = counterTrade
						const nfts = (counterTradeInfo.associatedAssets ?? [])
							.filter(x => x.cw721Coin)
							.map(x => x.cw721Coin) as NFT[]

						const coins = (counterTradeInfo.associatedAssets ?? [])
							.filter(x => x.coin)
							.map(x => x.coin) as HumanCoin[]

						const profileImage = nameServiceResolutions[index]?.extension?.image
						const name = nameServiceResolutions[index]?.extension?.name ?? ''

						return (
							<TableBodyRow key={id} onClick={() => viewCounterTrade(counterTrade)}>
								<TableBodyRowCell style={{ verticalAlign: 'top' }}>
									<Flex sx={{ gap: '12px', flex: 1 }}>
										<NameServiceImagePlaceholder>
											{profileImage ? (
												<NameServiceImage src={fromIPFSImageURLtoImageURL(profileImage)} />
											) : (
												<AvatarIcon width='100%' height='100%' />
											)}
										</NameServiceImagePlaceholder>
										<div>
											<OverflowTip>
												<NameLabel>{name}</NameLabel>
											</OverflowTip>
											<OverflowTip>
												<div>{counterTradeInfo?.owner ?? ''}</div>
											</OverflowTip>
											<OverflowTip>
												<div>
													{`''${
														counterTradeInfo?.additionalInfo?.ownerComment?.comment ?? ''
													}''`}
												</div>
											</OverflowTip>
										</div>
									</Flex>
								</TableBodyRowCell>
								<TableBodyRowCell>
									<Flex
										sx={{
											flex: 1,
											maxWidth: '144px',
											justifyContent: 'flex-start',
										}}
									>
										<PreviewNFTsSection>
											{nfts.slice(0, previewItemsLimit).map(nft => (
												<PreviewImageContainer
													key={`${nft.collectionAddress}_${nft.tokenId}`}
												>
													{nft.id?.every(img => img === '') ? (
														<ImagePlaceholder width='18px' height='18px' />
													) : (
														<PreviewImage src={nft.id ?? []} />
													)}
												</PreviewImageContainer>
											))}
											{(nfts || []).slice(previewItemsLimit).length
												? `+${(nfts || []).slice(previewItemsLimit).length}`
												: ''}
										</PreviewNFTsSection>
									</Flex>
								</TableBodyRowCell>
								<TableBodyRowCell>
									<Flex
										sx={{
											minWidth: '160px',
											justifyContent: 'flex-start',
										}}
									>
										{!coins.length && (
											<TokenChip>
												<Box sx={{ flex: 1, justifyContent: 'center' }}>
													<div>-</div>
												</Box>
											</TokenChip>
										)}
										{coins.map(({ amount, currency }) => (
											<TokenChip key={JSON.stringify({ amount, currency, id })}>
												<StarIcon />
												<div>{`${amount} ${currency}`}</div>
											</TokenChip>
										))}
									</Flex>
								</TableBodyRowCell>
								<TableBodyRowCell>
									<Box sx={{ textTransform: 'capitalize' }}>
										{counterTrade.tradeInfo.state}
									</Box>
								</TableBodyRowCell>
								<TableBodyRowCell>
									<Flex
										sx={{
											minWidth: '100px',
											justifyContent: 'flex-start',
										}}
									>
										{moment(counterTradeInfo?.additionalInfo?.time).fromNow()}
									</Flex>
								</TableBodyRowCell>

								<TableBodyRowCell
									onClick={e => {
										e.stopPropagation()
										e.preventDefault()
									}}
								>
									<Flex
										sx={{
											gap: '12px',
										}}
									>
										{/* When trade is countered and I am the offerer and counter trade is
										published. 
											* I can refuse/deny counter trade.
											* I can accept/approve trade offer.
										*/}

										{isMyTrade &&
											[TRADE_STATE.Countered].includes(tradeInfo?.state as TRADE_STATE) &&
											!isMyCounterTrade &&
											[TRADE_STATE.Published].includes(counterTrade?.tradeInfo.state) && (
												<>
													<Button
														fullWidth
														variant='primary'
														onClick={() => handleApprove(counterTrade)}
													>
														{/* {t('trade-listings:counter-offers.table.approve')} */}
														Approve
													</Button>

													<Button
														onClick={() => handleDeny(counterTrade)}
														variant='secondary'
														fullWidth
													>
														{/* {t('trade-listings:counter-offers.table.deny')} */}
														Deny
													</Button>
												</>
											)}
										{/* 
											When trade is not mine, trade is any state, my counter trade is refused (not accepted) or cancelled I can
											* Withdraw my assets from counter trade.
										*/}
										{!isMyTrade &&
											isMyCounterTrade &&
											!counterTrade?.tradeInfo?.assetsWithdrawn &&
											[TRADE_STATE.Refused, TRADE_STATE.Cancelled].includes(
												counterTrade?.tradeInfo?.state
											) && (
												<Button onClick={async () => withdrawCounterTrade(counterTrade)}>
													{/* {t('common:withdraw')} */}
													Withdraw
												</Button>
											)}

										{/* When trade is not mine, in any state, my counter trade is published I can
										 * Cancel and withdraw from counter trade.
										 */}
										{!isMyTrade &&
											isMyCounterTrade &&
											[TRADE_STATE.Published].includes(counterTrade?.tradeInfo?.state) && (
												<Button onClick={async () => cancelCounterTrade(counterTrade)}>
													{/* {t('common:remove')} */}
												Remove
												</Button>
											)}

										{isMyTrade &&
											[TRADE_STATE.Accepted].includes(tradeInfo?.state as TRADE_STATE) &&
											!isMyCounterTrade &&
											[TRADE_STATE.Accepted].includes(counterTrade?.tradeInfo?.state) &&
											!counterTrade?.tradeInfo?.assetsWithdrawn && (
												<Button onClick={() => withdrawAccepted(counterTrade)}>
													{/* {t('common:withdraw')} */}
												Withdraw
												</Button>
											)}

										{!isMyTrade &&
											isMyCounterTrade &&
											!counterTrade?.tradeInfo?.assetsWithdrawn &&
											![TRADE_STATE.Accepted].includes(tradeInfo?.state as TRADE_STATE) &&
											[TRADE_STATE.Created].includes(counterTrade?.tradeInfo?.state) && (
												<Button onClick={async () => confirmCounter(counterTrade)}>
													{/* {t('common:publish')} */}
													Publish
												</Button>
											)}
									</Flex>
								</TableBodyRowCell>
							</TableBodyRow>
						)
					})}
				</TableBody>
			</Table>
			<Flex sx={{ mt: '12px' }}>
				{counterTrades?.data && !!counterTrades.data?.length && !isLoading && (
					<Button
						disabled={counterTrades?.page === counterTrades.pageCount}
						fullWidth
						variant='dark'
						onClick={() => setPage(prev => prev + 1)}
					>
						{/* {t('common:show-more')} */}
						Show More
					</Button>
				)}
			</Flex>
		</Container>
	)
}

CounterOffersTable.defaultProps = {
	trade: undefined,
	excludeTopBorder: false,
}

export default CounterOffersTable
