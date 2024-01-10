// import NiceModal from '@ebay/nice-modal-react'
// // import { useWallet, WalletStatus } from '@terra-money/wallet-kit'
// import { useChain, useManager, useWallet } from "@cosmos-kit/react";
// import { LinkButton } from '@/components/link'
// import { Button } from '@/components/ui'
// // import { useTranslation } from 'next-i18next'
// import React from 'react'
// import { Flex } from 'theme-ui'
// import * as ROUTES from '@/constants/routes'
// import WatchListTradeAsset from '@/assets/images/WatchListTradeAsset'
// import { ConnectWalletModal } from '@/components/shared/modals/connect-wallet-modal/ConnectWalletModal'
// import {
// 	WatchListCard,
// 	Title,
// 	Description,
// 	WatchListEmptyContainer,
// 	WatchListAssetImageContainer,
// } from './WatchList.styled'
// import { CHAIN_NAME } from '@/utils/blockchain/networkUtils';

// function WatchListTrade() {
// 	const {wallet, status} = useChain(CHAIN_NAME)

// // 	const { t } = useTranslation(['common', 'dashboard'])

// 	const connectWallet = () => {
// 		NiceModal.show(ConnectWalletModal)
// 	}

// 	return (
// 		<WatchListCard>
// 			<WatchListEmptyContainer>
// 				<Flex sx={{ gap: ['12px'], flexDirection: 'column' }}>
// 					<Title>
// {/* {t('dashboard:watch-list.no-watching-any-listings')} */}
// You aren't watching any listings yet.
// </Title>
// 					<Description>
// 						{/* {t('dashboard:watch-list.explore-generic-description')} */}
// 						Go explore some offers from the community to find your next gem.
// 					</Description>
// 					<Flex sx={{ mt: '8px' }}>
// 						{status === 'Disconnected' ? (
// 							<Button onClick={connectWallet} variant='gradient' size='large'>
// 								{/* {t('common:connect-wallet')} */}
// 							Connect Wallet
// 							</Button>
// 						) : (
// 							<LinkButton variant='gradient' size='large' href={ROUTES.TRADE_LISTINGS}>
// 								{/* {t('dashboard:watch-list.explore-generic')} */}
// 						Explore Listings
// 							</LinkButton>
// 						)}
// 					</Flex>
// 				</Flex>
// 			</WatchListEmptyContainer>
// 			<WatchListAssetImageContainer>
// 				<WatchListTradeAsset />
// 			</WatchListAssetImageContainer>
// 		</WatchListCard>
// 	)
// }

// export default WatchListTrade
