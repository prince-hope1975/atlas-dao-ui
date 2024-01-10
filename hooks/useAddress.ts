// import { useConnectedWallet } from '@terra-money/wallet-kit'
import { CHAIN_NAME } from "@/utils/blockchain/networkUtils";
import {  useChain, useWallet } from "@cosmos-kit/react";

export const NO_WALLET = 'no-wallet'

const useAddress = () => {
	const { address
	 } = useChain(CHAIN_NAME);

	return address ?? NO_WALLET
}

export default useAddress
