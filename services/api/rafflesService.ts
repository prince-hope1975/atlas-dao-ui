import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { axios } from '../axios'
import {
	APIGetAllResponse,
	NetworkName,
	APIPagination,
	HumanCoin,
	// HumanCw20Coin,
} from '../../types'
import { keysToCamel } from '../../utils/js/keysToCamel'
import { NFT } from './walletNFTsService'

export enum RAFFLE_STATE {
	Closed = 'closed',
	Created = 'created',
	Started = 'started',
	Finished = 'finished',
	Claimed = 'claimed',
	Cancelled = 'cancelled',
}

export interface RaffleParticipant {
	id: number
	raffleId: number
	user: string
	ticketNumber: number
	updatedAt: string
	raffle: string
}
export interface Raffle {
	network: NetworkName
	raffleId: number
	id: number
	raffleInfo: {
		id: number
		owner: string
		allAssociatedAssets: { cw721Coin?: NFT; sg721Token?: NFT }[]
		raffleTicketPrice: {
			// cw20Coin: HumanCw20Coin & { rawAmount: string }
			coin: HumanCoin & { rawAmount: string }
		}
		numberOfTickets: number
		randomnessOwner?: string
		winner?: string
		state: RAFFLE_STATE
		raffleOptions: {
			raffleStartDate: string // ISO 8261 Date
			raffleDuration: number // seconds
			raffleTimeout: number // seconds
			comment?: string
			maxParticipantNumber: number
			maxTicketPerAddress?: number
			rafflePreview: {
				cw721Coin?: NFT
				sg721Token?: NFT
			}
		}
	}
	participants?: RaffleParticipant[]
}

export type RafflesResponse = APIGetAllResponse<Raffle>

type RaffleFilters = {
	raffleIds?: string[]
	states?: string[]
	collections?: string[]
	participatedBy?: string[]
	owners?: string[]
	excludeRaffles?: (string | number)[]
	favoritesOf?: string
	search?: string
	wonByMe?: boolean
	excludeMyRaffles?: boolean
	myAddress: string
	hasParticipants?: boolean
}

export class RafflesService {
	public static async getAllRaffles(
		network: string,
		filters?: RaffleFilters,
		pagination?: APIPagination,
		sort: 'ASC' | 'DESC' = 'ASC'
	): Promise<RafflesResponse> {
		const queryBuilder = RequestQueryBuilder.create()

		queryBuilder.search({
			$and: [
				{
					network,
				},
				...(filters?.raffleIds?.length
					? [
							{
								raffleId: {
									$in: filters?.raffleIds,
								},
							},
					  ]
					: []),

				...(filters?.states?.length
					? [
							{
								state: {
									$in: filters?.states,
								},
							},
					  ]
					: []),

				...(filters?.collections?.length
					? [
							{
								'cw721Assets_collection_join.collectionAddress': {
									$in: filters?.collections,
								},
							},
							// {
							// 	'sg721Assets_collection_join.collectionAddress': {
							// 		$in: filters?.collections,
							// 	},
							// },
					  ]
					: []),

				...(filters?.hasParticipants
					? [
							{
								'participants.ticketNumber': {
									$ne: 0,
								},
							},
					  ]
					: []),

				...(filters?.participatedBy?.length
					? [
							{
								'participants.user': {
									$in: filters?.participatedBy,
								},
							},
					  ]
					: []),

				...(filters?.owners?.length
					? [
							{
								owner: {
									$in: filters?.owners,
								},
							},
					  ]
					: []),

				...(filters?.excludeRaffles
					? [
							{
								raffleId: {
									$notin: filters?.excludeRaffles,
								},
							},
					  ]
					: []),
				...(filters?.favoritesOf
					? [
							{
								'raffleFavorites.user': {
									$eq: filters?.favoritesOf,
								},
							},
					  ]
					: []),
				...(filters?.search?.length
					? [
							{
								'cw721Assets.allNftInfo': {
									$cont: filters?.search,
								},
							},
							// {
							// 	'sg721Assets.allNftInfo': {
							// 		$cont: filters?.search,
							// 	},
							// },
					  ]
					: []),
				...(filters?.excludeRaffles
					? [
							{
								owner: {
									$notin: [filters.myAddress],
								},
							},
					  ]
					: []),
				...(filters?.wonByMe
					? [
							{
								winner: {
									$eq: filters?.myAddress,
								},
							},
					  ]
					: []),
			],
		})

		if (pagination?.limit) {
			queryBuilder.setLimit(pagination?.limit)
		}

		if (pagination?.page) {
			queryBuilder.setPage(pagination?.page)
		}

		if (sort) {
			queryBuilder.sortBy({
				field: 'raffleEndDate',
				order: sort,
			})
		}

		const response = await axios.get(`raffles?${queryBuilder.query()}`)

		return response.data
	}

	public static async getRaffle(
		network: string,
		raffleId: string
	): Promise<Raffle> {
		const response = await axios.patch(
			`raffles?network=${network}&raffleId=${raffleId}`
		)

		return keysToCamel(response.data)
	}
}
