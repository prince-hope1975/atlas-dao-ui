// import { useQuery } from '@tanstack/react-query'

// // import { useTranslation } from 'next-i18next'
// import React from 'react'
// import useAddress from '@/hooks/useAddress'
// import { TradesService } from '@/services/api'
// import { COUNTERED_TRADES, TRADES } from '@/constants/useQueryKeys'
// import { TRADE_STATE } from '@/services/api/tradesService'
// import { MultiSelectAccordionInputOption } from '../ui/multi-select-accordion-input/MultiSelectAccordionInput'
// import { getNetworkName } from '@/utils/blockchain/networkUtils'
// import TradeOffers from './TradeOffers'

// function OutgoingTradeOffers() {
// 	const networkName = getNetworkName()
// 	const [page, setPage] = React.useState(1)
// 	const myAddress = useAddress()
// // 	const { t } = useTranslation(['common', 'dashboard'])

// 	// const [
// 	// 	activeStatusLabel,
// 	// 	inactiveStatusLabel,
// 	// 	cancelledStatusLabel,
// 	// 	publishedStatusLabel,
// 	// 	counteredStatusLabel,
// 	// 	acceptedStatusLabel,
// 	// ]: Array<string> = t('dashboard:trades:statuses', {
// 	// 	returnObjects: true,
// 	// })
// 	const statusOptions = [
// 		{
// 			label: "Active",// activeStatusLabel,
// 			value: JSON.stringify([TRADE_STATE.Published, TRADE_STATE.Countered]),
// 		},
// 		{
// 			label: "Inactive", // inactiveStatusLabel,
// 			value: JSON.stringify([TRADE_STATE.Cancelled, TRADE_STATE.Accepted]),
// 		},
// 		{
// 			label: "Cancelled", // cancelledStatusLabel,
// 			value: JSON.stringify([TRADE_STATE.Cancelled]),
// 		},
// 		{
// 			label:  "Published", // publishedStatusLabel,
// 			value: JSON.stringify([TRADE_STATE.Published]),
// 		},
// 		{
// 			label:  "Countered", // counteredStatusLabel,
// 			value: JSON.stringify([TRADE_STATE.Countered]),
// 		},
// 		{
// 			label: "Accepted", // acceptedStatusLabel,
// 			value: JSON.stringify([TRADE_STATE.Accepted]),
// 		},
// 	]

// 	const [statuses, setStatuses] = React.useState<
// 		MultiSelectAccordionInputOption[]
// 	>([])

// 	const [collections, setCollections] = React.useState<
// 		MultiSelectAccordionInputOption[]
// 	>([])

// 	const { data: allTrades, isFetched: allFetched } = useQuery(
// 		[COUNTERED_TRADES, networkName, myAddress],
// 		async () =>
// 			TradesService.getAllTrades(
// 				networkName,
// 				{
// 					myAddress,
// 					counteredBy: [myAddress],
// 				},
// 				{
// 					page,
// 					limit: 1,
// 				}
// 			),
// 		{
// 			retry: true,
// 		}
// 	)

// 	const {
// 		data: trades,
// 		isLoading,
// 		refetch,
// 		isFetched: tradesFetched,
// 	} = useQuery(
// 		[TRADES, networkName, myAddress, page, statuses, collections, allFetched],
// 		async () =>
// 			TradesService.getAllTrades(
// 				networkName,
// 				{
// 					myAddress,
// 					states: statuses.flatMap(({ value }) => JSON.parse(value)),
// 					collections: collections.map(({ value }) => value),
// 					counteredBy: [myAddress],
// 				},
// 				{
// 					page,
// 					limit: 3,
// 				}
// 			),
// 		{
// 			enabled: allFetched,
// 			retry: true,
// 		}
// 	)

// 	return (
// 		<TradeOffers
// 			trades={trades}
// 			allTrades={allTrades}
// 			setPage={setPage}
// 			page={page}
// 			isLoading={isLoading}
// 			refetch={refetch}
// 			setStatuses={setStatuses}
// 			statuses={statuses}
// 			collections={collections}
// 			setCollections={setCollections}
// 			statusOptions={statusOptions}
// 			tradesFetched={tradesFetched}
// 		/>
// 	)
// }

// export default OutgoingTradeOffers
