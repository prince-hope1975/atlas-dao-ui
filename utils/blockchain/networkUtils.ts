import { AccountData } from '@cosmjs/amino'
import { SigningCosmWasmClient, ExecuteInstruction } from '@cosmjs/cosmwasm-stargate'
import { ContractName, ChainId, NetworkName } from '../../types'
import { contractAddresses } from '@/constants/addresses'
import { ConnectResponse, WalletResponse } from '@terra-money/wallet-kit'
import { txExplorerFactory } from '@/constants/transactions'
import { CHAIN_CURRENCIES, CHAIN_DENOMS } from '@/constants/core'
import {  MsgExecuteContractResponse } from 'juno-network/types/codegen/cosmwasm/wasm/v1/tx';
import {
	MsgExecuteContract,
	Coins,
	Coin,
	TxInfo,
	LCDClient,
	ExtensionOptions,
	Msg,
} from '@terra-money/feather.js'
// import {MsgExecuteContract} from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { TxReceipt } from '@/services/blockchain/blockchain.interface'
import { ChainContext, Wallet, WalletAccount, WalletBase, WalletClient, WalletClientContext, WalletContext } from '@cosmos-kit/core'
import { useWallet } from '@cosmos-kit/react'

export type NativeCurrency = typeof CHAIN_DENOMS[ChainId]

interface TransactionDetails {
	contractAddress: string
	message: object
	coins?: CoinsDetails
}


const CHAIN_NAMES = [
    'stargaze', // CHAIN_NAMES[0]
    'stargazetestnet',  // CHAIN_NAMES[1]
    'juno',  // CHAIN_NAMES[2]
    'junotestnet', // CHAIN_NAMES[3]
    'terpnetwork',  // CHAIN_NAMES[4]
    "terpnetworktestnet"  // CHAIN_NAMES[5]
];

export const DEFAULT_DECIMALS = 6
export const NETWORK_TYPE = 'testnet'
export const CHAIN_ID = 'elgafar-1'
export const NETWORK_NAME: string = 'stargazetestnet'

interface CoinsDetails {
	denom?: string
}


let wallet: ChainContext  | undefined
let connectedWallet: WalletAccount | undefined
let client: LCDClient

// let wallet: WalletResponse | undefined
// let connectedWallet: ConnectResponse | undefined
// let client: LCDClient

// RETURN NETWORK TYPE FOR STARGAZE
export function getNetworkName(): NetworkName {

	if (CHAIN_ID == 'elgafar-1') {
		return 'testnet'
	}

	if (CHAIN_ID == 'stargaze-1') {
		return 'mainnet'
	}

	return 'testnet'
}

// RETURN CHAIN-ID FOR STARGAZE 
export function getChainId(): ChainId {
	if (NETWORK_TYPE === 'testnet') {
		return 'elgafar-1'
	}

	if (getNetworkName() === 'mainnet') {
		return 'stargaze-1'
	}

	return 'elgafar-1'
}

// RETURN LATEST BLOCK HEIGHT
async function getLatestBlockHeight() {
	const chainId = getChainId()
	const blockInfo = await client.tendermint.blockInfo(chainId)

	return blockInfo
}

// GET CHAINIDS FOR A GIVEN DENOM
function getDefaultChainDenom(): string {
	const chainId = getChainId()

	return CHAIN_DENOMS[chainId]
}

// RETURN DEPLOYED CONTRACT ADDRESSES
function getContractAddress(contractName: ContractName): string {
	const chainId = getChainId()
	return contractAddresses[chainId][contractName]
}

function checkWallet(parentFunctionName: string): void {
	if (!wallet) {
		throw new Error(`${parentFunctionName} function requires connected wallet`)
	}
}

async function getWalletAddress(): Promise<string> {
	const chainId = getChainId()
	const wallet = useWallet()

	return connectedWallet?.address ?? ''
}
function setWallet(newWallet: ChainContext) {
	// console.log(`Setting a new wallet in blockchain.ts module`, { newWallet });
	wallet = newWallet
}

function setConnectedWallet(newWallet?: WalletAccount) {
	connectedWallet = newWallet
}

function getDenomForCurrency(currency: NativeCurrency) {
	if (!Object.values(CHAIN_CURRENCIES).includes(currency.toLowerCase())) {
		throw new Error(`Unsupported currency: ${currency.toUpperCase()}`)
	}

	return `u${currency.toLowerCase()}`
}

function getCurrencyForDenom(denom: string): NativeCurrency {
	if (!Object.values(CHAIN_DENOMS).includes(denom.toLowerCase())) {
		throw new Error(`Unsupported denom: ${denom.toUpperCase()}`)
	}

	return `${denom.substring(1).toUpperCase()}`
}

function getCoinsConfig(coins?: CoinsDetails): Coins.Input | undefined {
	if (coins) {
		const coinObjects: Coin[] = Object.entries(coins).map(([currency, amount]) =>
			Coin.fromData({ denom: getDenomForCurrency(currency), amount })
		)

		return new Coins(coinObjects)
	}
	return undefined
}

// QUERY CONTRACT
async function sendQuery(contractAddress: string, query: object): Promise<any> {
	return client.wasm.contractQuery(contractAddress, query)
}

// ESTIMATE FEE
// async function estimateTxFee(messages: Msg[]) {
// 	const address = await getWalletAddress()

// 	const memo = 'estimate fee'

// 	const accountInfo = await client.auth.accountInfo(address)

// 	const txOptions: ExtensionOptions = {
// 		chainID: getChainId(),
// 		msgs: messages,
// 		gasAdjustment: 1.4,
// 		memo,
// 	}

// 	return client.tx.estimateFee(
// 		[
// 			{
// 				sequenceNumber: accountInfo.getSequenceNumber(),
// 				publicKey: accountInfo.getPublicKey(),
// 			},
// 		],
// 		txOptions
// 	)
// }

// SIGN & BROADCAST MULTIPLE TX
async function postManyTransactions(
	txs: TransactionDetails[],
	memo?: string
): Promise<TxReceipt> {
	checkWallet('postManyTransactions')

	const address = await getWalletAddress()

	const msgs = txs.map(tx => {
		const coins = getCoinsConfig(tx.coins)
		return new MsgExecuteContract(address, tx.contractAddress, tx.message, coins)
	})

	const fee = await estimateTxFee(msgs)



	const tx = await wallet?.post({
		chainID: getChainId(),
		msgs,
		memo,
		fee,
	})
	const txId = tx?.txhash ?? ''

	const explorerUrl = getTxExplorer(txId)

	return {
		txId,
		txFee: `< 0.2 ${getCurrencyForDenom(getDefaultChainDenom())}`,
		explorerUrl,
	}
}
 // SIGN & BROADCAST SINGLE TRANSACTION
async function postTransaction(
	tx: TransactionDetails,
	memo?: string
): Promise<TxReceipt> {
	return postManyTransactions([tx], memo)
}

// RETURN BLOCK EXPLORER LINK
export const getTxExplorer = (txId?: string) =>
	txExplorerFactory[getChainId()](txId)

function createAmountConverter(decimals: number) {
	return {
		userFacingToBlockchainValue: (amount?: number | string) =>
			String(Math.floor(Number(amount ?? 0) * 10 ** decimals)),
		blockchainValueToUserFacing: (amount: any) => Number(amount) / 10 ** decimals,
	}
}

export const amountConverter = {
	default: createAmountConverter(DEFAULT_DECIMALS),
}
export default {
	getLatestBlockHeight,
	sendQuery,
	setConnectedWallet,
	// setLcdClient,
	// sendIndependentQuery,
	postTransaction,
	postManyTransactions,
	getChainId,
	getWalletAddress,
	setWallet,
	getDefaultChainDenom,
	getCurrencyForDenom,
	getDenomForCurrency,
	amountConverter,
	// getTxResult,
	getTxExplorer,
	getContractAddress,
	// getAverageBlockTime,
}

export type { TransactionDetails }