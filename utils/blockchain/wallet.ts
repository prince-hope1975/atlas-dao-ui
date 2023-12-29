import { useChain as useCosmosKitChain } from '@cosmos-kit/react'
import { chains } from 'chain-registry'
import { getConfig } from '../../config/network'

import { NETWORK_TYPE } from '../blockchain/networkUtils'

/**
 * Hook to retrieve the wallet for the current chain.
 */
export const useWallet = () => {
  const { chainId } = getConfig(NETWORK_TYPE)
  const chain = chains.find((c) => c.chain_id === chainId)
  if (!chain) {
    throw new Error('Chain not found')
  }

  return useCosmosKitChain(chain.chain_name)
}
