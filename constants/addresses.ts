import { ContractName, ChainId } from '../types'

export enum CONTRACT_NAME {
	loan = 'loan',
	raffle = 'raffle',
	// p2pTrade = 'p2pTrade',
	feeCollector = 'feeCollector',
	nameService = 'nameService',
}

export const contractAddresses: {
	[k in ChainId]: { [key in ContractName]: string }
} = {
	'stargaze-1': {
		loan: '',
		raffle: '',
		// p2pTrade: '',
		feeCollector:
			'',
		nameService:
			'',
	},
	'elgafar-1': {
		loan: 'stars1va4x0wjq0nddduc07vjfga6uqch5ptfshggk0rtvnzjm4ycujddqwpaqqy',
		raffle: '',
		// p2pTrade: '',
		feeCollector:
			'',
		nameService:
			'',
	}
}
