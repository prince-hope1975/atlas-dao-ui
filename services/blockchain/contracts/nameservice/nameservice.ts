import { CONTRACT_NAME } from '../../../../constants/addresses'
import networkUtils from '../../../../utils/blockchain/networkUtils'
import { keysToCamel } from '../../../../utils/js/keysToCamel'
import { Contract } from '../shared'

export type Binary = string
export type EmbeddedLogo =
	| {
			svg: Binary
	  }
	| {
			png: Binary
	  }

export type Logo =
	| {
			url: string
	  }
	| {
			embedded: EmbeddedLogo
	  }
export interface Metadata {
	contractAddress?: string | null
	discord?: string | null
	email?: string | null
	externalUrl?: string | null
	github?: string | null
	image?: string | null
	imageData?: Logo | null
	name?: string | null
	parentTokenId?: string | null
	pgpPublicKey?: string | null
	publicBio?: string | null
	publicName?: string | null
	telegram?: string | null
	twitter?: string | null
	[k: string]: unknown
}
export interface ReverseRecordResponse {
	name: string
	tokenId: string
	[k: string]: unknown
}
export interface ReverseRecordsItemResponse {
	address: string
	record?: ReverseRecordResponse | null
	[k: string]: unknown
}
export interface ReverseRecordsResponse {
	records: ReverseRecordsItemResponse[]
	[k: string]: unknown
}

export interface NftInfoResponse {
	extension: Metadata
	tokenUri?: string | null
	[k: string]: unknown
}

class NameServiceContract extends Contract {
	static async getOwnerOfDomain(tokenId: string): Promise<string> {
		const contractAddress = networkUtils.getContractAddress(
			CONTRACT_NAME.nameService
		)

		const response = await networkUtils.sendQuery(contractAddress, {
			owner_of: {
				token_id: tokenId,
			},
		})

		return response.owner
	}

	static async reverseRecords(
		addresses: string[]
	): Promise<ReverseRecordsResponse> {
		const contractAddress = networkUtils.getContractAddress(
			CONTRACT_NAME.nameService
		)

		const response = await networkUtils.sendQuery(contractAddress, {
			reverse_records: {
				addresses,
			},
		})

		return keysToCamel(response)
	}

	static async getDomainInfo(tokenId: string): Promise<NftInfoResponse> {
		const contractAddress = networkUtils.getContractAddress(
			CONTRACT_NAME.nameService
		)

		const response = await networkUtils.sendQuery(contractAddress, {
			nft_info: {
				token_id: tokenId,
			},
		})

		return keysToCamel(response)
	}
}

export default NameServiceContract
