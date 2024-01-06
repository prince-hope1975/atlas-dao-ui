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
		loan: 'stars1euv7jkr6zvu8854k8f8806tv8np2ju3ycgr2skj8yr0sufcsjzmqp66t89',
		raffle: 'stars1wh2k2kpzpr8v6gcv2al8cmvul9r8q5yr0ul5xm9uscxe358758gqzx9gmn',
		// p2pTrade: '',
		feeCollector:
			'',
		nameService:
			'',
	}
}
