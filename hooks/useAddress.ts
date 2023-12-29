// import { useConnectedWallet } from '@terra-money/wallet-kit'
import { NETWORK_NAME } from "@/utils/blockchain/networkUtils";
import {  useChain, useWallet } from "@cosmos-kit/react";

export const NO_WALLET = 'no-wallet'

const useAddress = () => {
	const { address
	 } = useChain(NETWORK_NAME);

	return address ?? NO_WALLET
}

export default useAddress
