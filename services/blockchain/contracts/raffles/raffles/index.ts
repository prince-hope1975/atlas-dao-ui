import { CONTRACT_NAME } from '@/constants/addresses'
import { DrandResponse } from '@/services/api/drandService'
import { NFT } from '@/services/api/walletNFTsService'
import { TxReceipt } from '@/services/blockchain/blockchain.interface'
// import { HumanCw20Coin } from '@/types'
import networkUtils, {
	amountConverter as converter,
} from '@/utils/blockchain/networkUtils'
import { keysToSnake } from '@/utils/js/keysToSnake'
import { Contract } from '../../shared'
import { Token } from '@/services/api/gqlWalletSercice'

const amountConverter = converter.default

export interface RaffleOptions {
	comment?: string
	maxParticipantNumber?: number
	maxTicketPerAddress?: number
	raffleDuration?: number
	rafflePreview?: number
	raffleStartTimestamp?: number
	raffleTimeout?: number
}

class RafflesContract extends Contract {
	static async provideRandomness(raffleId: number, randomness: DrandResponse) {
		const raffleContractAddress = networkUtils.getContractAddress(
			CONTRACT_NAME.raffle
		)

		return networkUtils.postTransaction({
			contractAddress: raffleContractAddress,
			message: {
				update_randomness: keysToSnake({
					raffleId,
					randomness,
				}),
			},
		})
	}

	static async createRaffleListing(
		nfts: Token[],
		ticketPrice: string | number,
		raffleOptions: RaffleOptions
	): Promise<TxReceipt> {
		const raffleContractAddress = networkUtils.getContractAddress(
			CONTRACT_NAME.raffle
		)

		return networkUtils.postManyTransactions([
			// Add cw721 tokens to raffle
			...nfts.flatMap(({ collectionAddress, tokenId }) => [
				{
					contractAddress: collectionAddress,
					message: {
						approve: {
							spender: raffleContractAddress,
							token_id: tokenId,
						},
					},
				},
			]),
			{
				contractAddress: raffleContractAddress,
				message: {
					create_raffle: {
						assets: [
							...nfts.flatMap(({ collectionAddress, tokenId }) => [
								{
									cw721_coin: {
										token_id: tokenId,
										address: collectionAddress,
									},
								},
							]),
						],
						raffle_options: keysToSnake(raffleOptions),
						raffle_ticket_price: {
							coin: {
								 // TODO: convert to display available raffle price denoms
								amount: amountConverter.userFacingToBlockchainValue(ticketPrice),
								// TODO: convert to display available raffle price denoms
								denom: 'ustars', 
							},
						},
					},
				},
			},
		])
	}

	static async cancelRaffleListing(raffleId: number) {
		const raffleContractAddress = networkUtils.getContractAddress(
			CONTRACT_NAME.raffle
		)

		return networkUtils.postTransaction({
			contractAddress: raffleContractAddress,
			message: {
				cancel_raffle: {
					raffle_id: raffleId,
				},
			},
		})
	}

	static async modifyRaffleListing(
		raffleId: number,
		raffleOptions: RaffleOptions,
		ticketPriceAmount?: number,
		ticketPriceCurrency?: string
	) {
		const raffleContractAddress = networkUtils.getContractAddress(
			CONTRACT_NAME.raffle
		)

		return networkUtils.postTransaction({
			contractAddress: raffleContractAddress,
			message: {
				modify_raffle: {
					raffle_id: raffleId,
					raffle_options: keysToSnake(raffleOptions),
					...(ticketPriceAmount
						? {
								raffle_ticket_price: {
									coin: {
										amount: amountConverter.userFacingToBlockchainValue(
											Number(ticketPriceAmount).toFixed(3)
										),
										denom: networkUtils.getDenomForCurrency(ticketPriceCurrency ?? ''),
									},
								},
						  }
						: {}),
				},
			},
		})
	}

	static async drawRaffle(raffleId: number) {
		const raffleContractAddress = networkUtils.getContractAddress(
			CONTRACT_NAME.raffle
		)

		return networkUtils.postTransaction({
			contractAddress: raffleContractAddress,
			message: {
				claim_nft: {
					raffle_id: raffleId,
				},
			},
		})
	}

	static async purchaseRaffleTickets(
		raffleId: number,
		ticketNumber: number,
		rawAmount: string,
		// cw20Coin?: HumanCw20Coin
	): Promise<TxReceipt> {
		const raffleContractAddress = networkUtils.getContractAddress(
			CONTRACT_NAME.raffle
		)

		return networkUtils.postManyTransactions([
			// ...(cw20Coin
			// 	? [
			// 			{
			// 				contractAddress: cw20Coin.address,
			// 				message: {
			// 					increase_allowance: {
			// 						spender: raffleContractAddress,
			// 						amount: amountConverter.userFacingToBlockchainValue(
			// 							(+cw20Coin.amount * ticketNumber).toFixed(6)
			// 						),
			// 					},
			// 				},
			// 			},
			// 	  ]
			// 	: []),

			{
				contractAddress: raffleContractAddress,
				message: {
					buy_ticket: {
						raffle_id: raffleId,
						ticket_number: ticketNumber,
						sent_assets: {
							// ...(cw20Coin
							// 	? {
							// 			cw20_coin: {
							// 				amount: amountConverter.userFacingToBlockchainValue(
							// 					(+cw20Coin.amount * ticketNumber).toFixed(6)
							// 				),
							// 				address: cw20Coin.address,
							// 			},
							// 	  }
							// 	: {}),
							...(rawAmount
								? {
										coin: {
											amount: String(+rawAmount * ticketNumber),
											denom: networkUtils.getDefaultChainDenom(), // TODO: update to handle all ibc denoms
										},
								  }
								: {}),
						},
					},
				},
				...(rawAmount
					? {
							coins: {
								denom: String(+rawAmount * ticketNumber),
							},
					  }
					: {}),
			},
		])
	}
}

export default RafflesContract
