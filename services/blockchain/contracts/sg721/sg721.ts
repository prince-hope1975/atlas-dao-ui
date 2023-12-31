import { TxReceipt } from '@/services/blockchain/blockchain.interface'

import networkUtils from '@/utils/blockchain/networkUtils'

import type { TransactionDetails } from '../../../../utils/blockchain/networkUtils'
import { NFT } from '@/services/api/walletNFTsService'
import { Contract } from '../shared'

class Sg721Contract extends Contract {
	static async transferTokens(
		nfts: (NFT & { recipient: string })[],
		memo?: string
	): Promise<TxReceipt> {
		const txs: TransactionDetails[] = nfts
			.map(nft => ({
				contractAddress: nft.collectionAddress,
				message: {
					transfer_nft: {
						token_id: nft.tokenId,
						recipient: nft.recipient,
					},
				},
			}))
			.filter(nft => nft.contractAddress)
		return networkUtils.postManyTransactions(txs, memo)
	}

	static async transferToken(
		nft: NFT,
		recipient: string,
		memo?: string
	): Promise<TxReceipt> {
		return this.transferTokens([{ ...nft, recipient }], memo)
	}

	static async getOwnerOfToken(
		nftContractAddress: string,
		tokenId: string
	): Promise<string> {
		const response = await networkUtils.sendQuery(nftContractAddress, {
			owner_of: {
				token_id: tokenId,
			},
		})

		return response.owner
	}
}

export default Sg721Contract
