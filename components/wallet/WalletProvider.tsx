// Styles required for @cosmos-kit/react modal
import '@interchain-ui/react/styles'
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as snapWallet } from "@cosmos-kit/leap-metamask-cosmos-snap";
import { GasPrice } from '@cosmjs/stargate'
import { wallets as keplrExtensionWallets } from '@cosmos-kit/keplr-extension'
import { wallets as leapExtensionWallets } from '@cosmos-kit/leap-extension'
import { ChainProvider } from '@cosmos-kit/react'
import { assets, chains } from 'chain-registry'
import { getConfig} from '../../config/network'
import type { ReactNode } from 'react'
import { NETWORK_TYPE } from '../../utils/blockchain/networkUtils'
import React from 'react';

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { gasPrice, feeToken } = getConfig(NETWORK_TYPE)
  return (
    <ChainProvider
      assetLists={assets}
      chains={chains}
      endpointOptions={{
        endpoints: {
          stargaze: {
            rpc: ['https://rpc.stargaze-apis.com/'],
            rest: ['https://rest.stargaze-apis.com/'],
          },
          stargazetestnet: {
            rpc: ['https://rpc.elgafar-1.stargaze-apis.com/'],
            rest: ['https://rest.elgafar-1.stargaze-apis.com/'],
          },
        },
        isLazy: true,
      }}
      sessionOptions={{
        duration: 1000 * 60 * 60 * 12, // 12 hours
      }}
      signerOptions={{
        signingCosmwasm: () => ({
          gasPrice: GasPrice.fromString(`${gasPrice}${feeToken}`),
        }),
        signingStargate: () => ({
          gasPrice: GasPrice.fromString(`${gasPrice}${feeToken}`),
        }),
      }}
      wallets={[...keplrExtensionWallets, ...leapExtensionWallets]}
    >
      {children}
    </ChainProvider>
  )
}
