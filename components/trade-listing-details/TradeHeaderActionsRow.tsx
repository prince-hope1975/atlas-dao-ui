import React from 'react'
// import { useTranslation } from 'next-i18next'

import { Box, Flex } from 'theme-ui'
import NiceModal from '@ebay/nice-modal-react'
import { IconButton } from '@/components/trade-listing-details'
// import { TwitterShareButton } from 'react-share'
import {
	DeleteOutlineIcon,
	PenOutlineIcon,
	ShareOutlineIcon,
	ArrowLeftIcon,
} from '@/assets/icons/mixed'
import {
	EditModal,
	RemoveModal,
	EditModalResult,
	RemoveModalProps,
	RemoveSuccessModal,
} from '@/components/trade-listing-details/modals'
import { asyncAction } from '@/utils/js/asyncAction'

import { fromUpdateTradeToBlockchain } from '@/utils/mappers/fromUpdateTradeToBlockchain'

import { Trade, TRADE_STATE } from '@/services/api/tradesService'
import { useRouter } from 'next/router'
import { noop } from 'lodash'
import { TxBroadcastingModal } from '@/components/shared'
import { useQueryClient } from '@tanstack/react-query'
import useAddress from '@/hooks/useAddress'
import { TRADE } from '@/constants/useQueryKeys'
import { P2PTradingContract } from '@/services/blockchain'
import { Button } from '@/components/ui'

import * as ROUTES from '@/constants/routes'

interface TradeHeaderActionsRowProps {
	trade?: Trade
}

export const TradeHeaderActionsRow = ({
	trade,
}: TradeHeaderActionsRowProps) => {
	const { tradeInfo } = trade ?? {}

	const router = useRouter()

	const queryClient = useQueryClient()

	const editDisabled = ![
		TRADE_STATE.Published,
		TRADE_STATE.Countered,
		TRADE_STATE.Created,
	].includes((tradeInfo?.state as TRADE_STATE) ?? TRADE_STATE.Cancelled)

	const removeDisabled = ![
		TRADE_STATE.Published,
		TRADE_STATE.Countered,
		TRADE_STATE.Created,
	].includes((tradeInfo?.state as TRADE_STATE) ?? TRADE_STATE.Cancelled)

	const myAddress = useAddress()

	const isMyTradeListing = tradeInfo?.owner === myAddress

	const handleEditClick = async () => {
		if (!trade) {
			return
		}
		const initialLookingFor = tradeInfo?.additionalInfo?.lookingFor ?? []
		const initialComment = tradeInfo?.additionalInfo?.ownerComment?.comment ?? ''

		const [, result] = await asyncAction<EditModalResult>(
			NiceModal.show(EditModal, {
				initialLookingFor,
				initialComment,
			})
		)

		if (result) {
			const { newTokensWanted, newNFTsWanted, comment } =
				fromUpdateTradeToBlockchain(result)

			const response = await NiceModal.show(TxBroadcastingModal, {
				transactionAction: P2PTradingContract.updateTrade(
					trade.tradeId,
					comment,
					newTokensWanted,
					newNFTsWanted
				),
				closeOnFinish: true,
			})

			if (response) {
				await queryClient.invalidateQueries([TRADE])
			}
		}
	}

	const handleRemoveClick = async () => {
		if (!trade) {
			return
		}
		const [, result] = await asyncAction<RemoveModalProps>(
			NiceModal.show(RemoveModal, {
				tradeId: trade.tradeId,
			})
		)

		if (result) {
			const cancelTradeResponse = await NiceModal.show(TxBroadcastingModal, {
				transactionAction: P2PTradingContract.cancelAndWithdrawTrade(
					Number(result.tradeId)
				),
				closeOnFinish: true,
			})

			if (cancelTradeResponse) {
				await queryClient.invalidateQueries([TRADE])
			}

			if (cancelTradeResponse) {
				NiceModal.show(RemoveSuccessModal, {
					tradeId: trade.tradeId,
				})
			}
		}
	}

	// const { t } = useTranslation(['common', 'trade-listings'])

	const origin =
		typeof window !== 'undefined' && window.location.origin
			? window.location.origin
			: ''

	return (
		<Flex
			sx={{
				mt: ['12.5px', '24px', '22px'],
				flex: 1,
				justifyContent: 'space-between',
			}}
		>
			<Flex
				sx={{
					justifyContent: 'flex-start',
				}}
			>
				<Button
					onClick={() => router.push(ROUTES.TRADE_LISTINGS)}
					sx={{ height: '40px', padding: '13px' }}
					variant='secondary'
					startIcon={<ArrowLeftIcon />}
				>
					{/* {t('trade-listings:back-to-listings')} */}
					Back to Listings
				</Button>
			</Flex>
			{isMyTradeListing && (
				<Flex
					sx={{
						gap: '6px',
						justifyContent: 'flex-end',
					}}
				>
					<IconButton disabled={editDisabled} onClick={handleEditClick}>
						<PenOutlineIcon />
						<Box sx={{ ml: 9, display: ['none', 'none', 'block'] }}>
						 {/* {t('common:edit')}  */}
						 Edit
						</Box>
					</IconButton>
					<IconButton disabled={removeDisabled} onClick={handleRemoveClick}>
						<DeleteOutlineIcon />
						<Box sx={{ ml: 9, display: ['none', 'none', 'block'] }}>
							{/* {t('common:remove')} */}
							Remove
						</Box>
					</IconButton>
					{/* <TwitterShareButton
						title={t('common:checkout-my-trade')}
						url={`${origin}${router.asPath}`}
					>
						<IconButton onClick={noop}>
							<ShareOutlineIcon />
							<Box sx={{ ml: 9, display: ['none', 'none', 'block'] }}>
								{t('common:share')}
							</Box>
						</IconButton>
					</TwitterShareButton> */}
				</Flex>
			)}
		</Flex>
	)
}

TradeHeaderActionsRow.defaultProps = {
	trade: undefined,
}

export default TradeHeaderActionsRow
