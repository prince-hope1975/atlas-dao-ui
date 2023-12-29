import networkUtils from '../../../../utils/blockchain/networkUtils'
import { keysToCamel } from '../../../../utils/js/keysToCamel'

export interface ContractInfo {
	name: string
	[key: string]: unknown
}

export class Contract {
	static async getContractInfo(
		nftContractAddress: string
	): Promise<ContractInfo> {
		const result = await networkUtils.sendQuery(nftContractAddress, {
			contract_info: {},
		})

		return keysToCamel(result)
	}
}
