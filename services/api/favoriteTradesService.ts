// import { RequestQueryBuilder } from '@nestjsx/crud-request'
// import { axios } from '../axios'
// import { NetworkName } from '../../types'

// export type FavoriteTradeRequest = {
// 	network: NetworkName
// 	user: string
// 	tradeId: (string | number)[]
// }

// export type FavoriteTradeResponse = {
// 	id: number
// 	network: NetworkName
// 	user: string
// 	trades: {
// 		id: number
// 		network: NetworkName
// 		tradeId: number
// 	}[]
// }

// export class FavoriteTradesService {
// 	static async addFavoriteTrade({
// 		network,
// 		user,
// 		tradeId,
// 	}: FavoriteTradeRequest): Promise<FavoriteTradeResponse> {
// 		const response = await axios.patch(
// 			`/trade-favorites/add?network=${network}&user=${user}&tradeId=${tradeId}`
// 		)

// 		return response.data
// 	}

// 	static async removeFavoriteTrade({
// 		network,
// 		user,
// 		tradeId,
// 	}: FavoriteTradeRequest): Promise<FavoriteTradeResponse> {
// 		const response = await axios.patch(
// 			`/trade-favorites/remove?network=${network}&user=${user}&tradeId=${tradeId}`
// 		)

// 		return response.data
// 	}

// 	static async getFavoriteTrades(
// 		{ network }: { network: NetworkName },
// 		filters
// 	): Promise<FavoriteTradeResponse[]> {
// 		const queryBuilder = RequestQueryBuilder.create()

// 		queryBuilder.search({
// 			$and: [
// 				{
// 					network,
// 				},
// 				...(filters?.users?.length
// 					? [
// 							{
// 								user: {
// 									$in: filters?.users,
// 								},
// 							},
// 					  ]
// 					: []),
// 			],
// 		})

// 		const response = await axios.get(`/trade-favorites/?${queryBuilder.query()}`)

// 		return response.data
// 	}
// }
