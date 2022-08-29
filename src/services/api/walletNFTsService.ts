import { axios } from 'services/axios'

export enum WalletNFTState {
	Full = 0, // All old txs were loaded
	Partial = 1, // There is still some old info to query to have a complete nft_interacted array
	isUpdating = 2, // THe API is currently updating info for the address
}

interface NFTAttribute {
	displayType?: string
	traitType: string
	value: string
}

export interface NFT {
	collectionAddress: string
	tokenId: string
	collectionName: string
	description: string
	imageUrl: string[]
	name?: string
	attributes?: NFTAttribute[]
	traits?: [string, string][]
}

export interface Collection {
	collectionAddress: string
	collectionName: string
}

export interface WalletNFTsResponse {
	ownedCollections: Collection[]
	state: WalletNFTState
	ownedTokens: NFT[]
	txs: {
		external: {
			oldest?: string
			newest?: string
		}
		internal: {
			oldest?: string
			newest?: string
		}
	}
}

export class WalletNFTsService {
	static async requestUpdateNFTs(
		network: string,
		address: string
	): Promise<WalletNFTsResponse> {
		const { data } = await axios.get(
			`/nft-content-api/query/${network}/${address}?action=update`
		)
		return data
	}

	static async requestNFTs(
		network: string,
		address: string
	): Promise<WalletNFTsResponse> {
		const { data } = await axios.get(
			`/nft-content-api/query/${network}/${address}?action=plain_db`
		)

		return data
	}
}
