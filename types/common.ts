import { CONTRACT_NAME } from '../constants/addresses'

export interface APIGetAllResponse<T> {
	data: T[]
	count: number
	total: number
	page: number
	pageCount: number
}

export interface APIPagination {
	page?: number
	limit?: number
}

export type Cw20Coin = {
	address: string
	amount: number
}
// export interface HumanCw20Coin {
// 	amount: string
// 	currency: string
// 	address: string
// }

export interface HumanCoin {
	amount: string
	currency: string
}

export type Coin = {
	amount: number | string
	denom: string
}

export type Cw721Coin = {
	address: string
	tokenId: string
}

export type Sg721Token = {
	address: string
	tokenId: string
}

export type ContractName = keyof typeof CONTRACT_NAME

export type ChainId = 'stargaze-1' | 'elgafar-1' 

export type NetworkName = 'mainnet' | 'testnet'

export type StargazeNft = {
	tokenId?: string | null
	name?: string | null
	description?: string | null
	collection: {
	  contractAddress?: string | null
	  name?: string | null
	}
	media?: {
	  url?: string | null
	  visualAssets?: {
		lg?: {
		  url?: string | null
		} | null
	  } | null
	} | null
  }

  export type NftCardInfo = {
	chainId: string
	key: string
	collectionAddress: string
	collectionName: string
	tokenId: string
	owner?: string
	externalLink?: {
	  href: string
	  name: string
	}
	imageUrl?: string
	// Metadata loaded from the token URI.
	metadata?: Record<string, any>
	floorPrice?: {
	  amount: number
	  denom: string
	}
	name: string
	description: string | undefined
  
	// // This indicates whether or not the NFT is staked in a DAO. It is manually
	// // set in `walletStakedLazyNftCardInfosSelector`.
	// staked?: boolean
  }