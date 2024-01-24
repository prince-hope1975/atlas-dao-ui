import { ContractName, ChainId } from '../types'

export enum CONTRACT_NAME {
	loan = 'loan',
	raffle = 'raffle',
	// p2pTrade = 'p2pTrade',
	feeCollector = 'feeCollector',
	nameService = 'nameService',
}

export const contractAddresses: {
  [k in ChainId]: { [key in ContractName]: string };
} = {
  "stargaze-1": {
    loan: "",
    raffle: "",
    // p2pTrade: '',
    feeCollector: "",
    nameService: "",
  },
  "elgafar-1": {
    loan: "stars1apzepc06ay3468yxpdvyszxx2nw67k27vjc2m36sgpv2xudp8c7sx72pe2",
    // loan: "stars1lwx6mevs922uq2sswtw6x09chqssv4emmuyernhh062vluqcnx9s6q2a7r",
    // loan: "stars1euv7jkr6zvu8854k8f8806tv8np2ju3ycgr2skj8yr0sufcsjzmqp66t89",
    raffle: "stars1hxd87kwjztq34gxkd63unsfalazx6jak5zcgtcwh4k9x6chqdlaqet7gfn",
    // raffle: "stars18mqhd9hl9zsu6ejx07krqhg3lruu72wmr6f0wlww44hh204lzf5qyhqsj4",
    // p2pTrade: '',
    feeCollector: "",
    nameService: "",
  },
};
