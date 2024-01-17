// import { AccountData } from '@cosmjs/amino'
import { SigningCosmWasmClient, MsgExecuteContractEncodeObject, JsonObject } from '@cosmjs/cosmwasm-stargate'
import { ContractName, ChainId, NetworkName } from '../../../types'
import { contractAddresses } from '@/constants/addresses'
import { txExplorerFactory } from '@/constants/transactions'
import { CHAIN_CURRENCIES, CHAIN_DENOMS } from '@/constants/core'
import { cosmos } from 'interchain-query'
import { TxReceipt } from '@/services/blockchain/blockchain.interface'
import { SimpleAccount, Wallet,} from '@cosmos-kit/core'
import {  } from '@cosmos-kit/keplr'
import { useWallet, useChain } from '@cosmos-kit/react'
import { Coin, SigningStargateClient, StdFee, coins ,GasPrice} from '@cosmjs/stargate'
import { TxRaw } from 'interchain-query/cosmos/tx/v1beta1/tx'
import { assets } from 'chain-registry';
import { toUtf8 } from '@cosmjs/encoding'

export type NativeCurrency = typeof CHAIN_DENOMS[ChainId]
export const STARGAZE_INDEXER_TOKENS_LIMIT = 100

const txRaw = cosmos.tx.v1beta1.TxRaw;


interface TransactionDetails {
	contractAddress: string
	message: JsonObject
	coins?: Coin[]
}


interface TxOptions {
	gas: string | number;
	// toast?: Partial<CustomToast>;
	onSuccess?: () => void;
}


export const CHAIN_NAME: string = 'stargazetestnet'
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



let wallet: Wallet | undefined
let connectedWallet: SimpleAccount | undefined
let client: SigningStargateClient
let cosmwasmClient: SigningCosmWasmClient

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
	// const chainId = getChainId()
	const blockInfo = await client.getBlock()

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
	// const chainId = getChainId()
	const wallet = useWallet()

	return connectedWallet?.address ?? ''
}
function setWallet(newWallet: Wallet) {
	// console.log(`Setting a new wallet in blockchain.ts module`, { newWallet });
	wallet = newWallet
}

function setConnectedWallet(newWallet?: SimpleAccount) {
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

// function getCoinsConfig(all_coins?: CoinsDetails): Coins.Input | undefined {
// 	if (all_coins) {
// 		const coinObjects: Coin[] = Object.entries(all_coins).map(([currency, amount]) =>
// 			Coin.fromData({ denom: getDenomForCurrency(currency), amount })
// 		)

// 		return new Coins(coinObjects)
// 	}
// 	return undefined
// }

export const STARGATE_ASSETS = assets.find(
	(chain) => chain.chain_name === CHAIN_NAMES[1]
)!.assets;


// QUERY CONTRACT
async function sendQuery(contractAddress: string, query: object): Promise<any> {
	return cosmwasmClient.queryContractSmart(contractAddress, query)
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
	options: TxOptions,
): Promise<TxReceipt> {
	checkWallet('postManyTransactions')

	const address = await getWalletAddress()
	const { sign, getSigningCosmWasmClient } = useChain(CHAIN_NAMES[1])

	const msgs: MsgExecuteContractEncodeObject[] = txs.map(tx => ({
		typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
		value: {
			sender: address,
			contract: tx.contractAddress,
			msg: toUtf8(JSON.stringify(tx.message)),
			funds: [...(tx.coins || [])],
		}
	}))

	const fee: StdFee = {
		amount: coins(0, "ustars"),
		gas: String(options.gas),
	};

	let signed: TxRaw;
	let client: SigningCosmWasmClient;


	client = await getSigningCosmWasmClient();

	const result = await client.signAndBroadcast(
		address,
		msgs,
		fee,
		"",
	)


	const txId = result?.transactionHash ?? ''

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
	options: TxOptions,
) {
	return postManyTransactions([tx], options)
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
export const useNetworkUtils=()=>{
	return {
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
  };
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