export interface TxReceipt {
	txId: string
	explorerUrl: string // TODO: change this for IBC, to more generic name.
	txFee: string
	code:number
	rawlog:string
}
