import React from 'react'
import styled from '@emotion/styled'
import { Box, Flex } from 'theme-ui'
// import { useTranslation } from 'next-i18next'
import { useQuery } from '@tanstack/react-query'

import { GRID_TYPE, TradeGridController } from '@/components/shared/trade'
import { TRADES, VERIFIED_COLLECTIONS } from '@/constants/useQueryKeys'
import useAddress from '@/hooks/useAddress'
import { SupportedCollectionsService } from '@/services/api'
import { TradesService, TRADE_STATE } from '@/services/api/tradesService'
import { isNil } from 'lodash'
import { getNetworkName } from '@/utils/blockchain/networkUtils'

const MightLikeText = styled(Flex)`
	font-size: 20px;
	line-height: 28px;
	font-family: 'Inter';
	font-style: normal;
	font-weight: 600;
`

MightLikeText.defaultProps = {
	sx: {
		fontSize: ['20px', '24px'],
		lineHeight: ['28px', '28px'],
	},
}

export interface TradeListingsYouMightLikeProps {
	search: string
	tradeId?: string | number
}

function TradeListingsYouMightLike({
	search,
	tradeId,
}: TradeListingsYouMightLikeProps) {
	const networkName = getNetworkName()
	// const { t } = useTranslation(['common', 'trade-listings'])
	const myAddress = useAddress()

	const { data: verifiedCollections } = useQuery(
		[VERIFIED_COLLECTIONS, networkName],
		async () => SupportedCollectionsService.getSupportedCollections(networkName),
		{
			retry: true,
		}
	)

	const { data: trades, isLoading } = useQuery(
		[TRADES, networkName, search, myAddress],
		async () =>
			TradesService.getAllTrades(
				networkName,
				{
					myAddress,
					search,
					states: [TRADE_STATE.Published, TRADE_STATE.Countered],
					excludeMyTrades: true,
					...(!isNil(tradeId) ? { excludeTrades: [tradeId] } : {}),
				},
				{
					page: 1,
					limit: 15,
				}
			),
		{
			retry: true,
		}
	)

	return (
		<Flex
			sx={{ minHeight: '400px', flexDirection: 'column', paddingBottom: '48px' }}
		>
			<Box
				sx={{
					marginBottom: ['16px', '25px'],
				}}
			>
				<MightLikeText>
					{/* {t('trade-listings:you-might-like')} */}
					Trade Listings You Might Like
					</MightLikeText>
			</Box>
			<Box sx={{ width: '100%' }}>
				<TradeGridController
					trades={trades?.data ?? []}
					isLoading={isLoading}
					verifiedCollections={verifiedCollections}
					gridType={Number(Boolean(GRID_TYPE.SMALL))}
				/>
			</Box>
		</Flex>
	)
}

export default TradeListingsYouMightLike
