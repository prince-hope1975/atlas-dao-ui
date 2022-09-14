import { useWallet } from '@terra-money/use-wallet'
import {
	getChainOptions,
	StaticWalletProvider,
	WalletControllerChainOptions,
	WalletProvider,
} from '@terra-money/wallet-provider'
import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextComponentType, NextPageContext } from 'next/types'
import { appWithTranslation } from 'next-i18next'
import NiceModal from '@ebay/nice-modal-react'
import { ThemeProvider } from 'theme-ui'

import { theme } from 'components'
import blockchain from 'utils/blockchain/terraUtils'
import './styles.css'

import 'rc-tooltip/assets/bootstrap_white.css'
import 'react-toastify/dist/ReactToastify.css'

import i18nConfig from '../../next-i18next.config'

const queryClient = new QueryClient()

const Main = ({
	Component,
	pageProps,
}: {
	Component: NextComponentType<NextPageContext, any, {}>
	pageProps: any
}) => {
	const wallet = useWallet()

	blockchain.setWallet(wallet)

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<RecoilRoot>
					<NiceModal.Provider>
						<Component {...pageProps} />
					</NiceModal.Provider>
				</RecoilRoot>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

const App = (props: AppProps & WalletControllerChainOptions) => {
	const { defaultNetwork, walletConnectChainIds } = props
	return typeof window !== 'undefined' ? (
		<WalletProvider
			defaultNetwork={defaultNetwork}
			walletConnectChainIds={walletConnectChainIds}
		>
			<Main {...props} />
		</WalletProvider>
	) : (
		<StaticWalletProvider defaultNetwork={defaultNetwork}>
			<Main {...props} />
		</StaticWalletProvider>
	)
}

App.getStaticProps = async () => {
	const chainOptions = await getChainOptions()
	return {
		...chainOptions,
	}
}

export default appWithTranslation(App, i18nConfig)
