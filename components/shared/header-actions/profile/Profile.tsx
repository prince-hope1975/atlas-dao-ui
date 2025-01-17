import NiceModal from '@ebay/nice-modal-react'
import React from 'react'
import { Img } from 'react-image'
import { Box, Flex } from 'theme-ui'
import styled from '@emotion/styled'
// import { useWallet, WalletStatus } from '@terra-money/wallet-kit'
// import { useTranslation } from 'next-i18next'

import {
	ChevronDownSmallIcon,
	ChevronUpSmallIcon,
} from '@/assets/icons/24ptOutline'
import { AvatarIcon } from '@/assets/icons/mixed'
import ViewUserProfileModal, {
	ViewUserProfileModalProps,
	ViewUserProfileResultProps,
} from '@/components/shared/modals/view-user-profile-modal/ViewUserProfileModal'
import { Button, OverflowTip } from '@/components/ui'
import { HEADER_HEIGHT } from '@/constants/components'
import useAddress, { NO_WALLET } from '@/hooks/useAddress'
import useNameService from '@/hooks/useNameService'
import { fromIPFSImageURLtoImageURL } from '@/utils/blockchain/ipfs'
import { asyncAction } from '@/utils/js/asyncAction'
import getShortText from '@/utils/js/getShortText'
import { MyNFTsModal } from '@/components/shared/modals'
import { ConnectWalletModal } from '@/components/shared/modals/connect-wallet-modal/ConnectWalletModal'
import { useChain, useWallet } from '@cosmos-kit/react'
import { CHAIN_NAME } from '@/utils/blockchain/networkUtils'

const ProfileTitle = styled(Box)`
	font-family: 'Inter';
	font-style: normal;
	font-weight: 700;
	font-size: 12px;
	line-height: 12px;

	color: ${props => props.theme.colors.gray1000};
`

const ProfileAddress = styled(ProfileTitle)`
	color: #b8bac1;
`

const DropdownContainer = styled(Flex)`
	flex-direction: column;
	background: ${props => props.theme.colors.dark300};

	border-radius: 8px;
`
DropdownContainer.defaultProps = {
	sx: {
		width: ['100%', '178px'],
	},
}

const DropdownItem = styled(Flex)`
	font-family: 'Inter';
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	line-height: 17px;
	align-items: center;
	justify-content: flex-start;

	height: 40px;

	border-radius: 0px;

	border: 1px solid ${props => props.theme.colors.dark500};

	padding: 0 16px;

	cursor: pointer;

	&:first-of-type {
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
	}

	&:last-of-type {
		border-bottom-left-radius: 6px;
		border-bottom-right-radius: 6px;
	}

	&:hover {
		background: ${props => props.theme.colors.dark100};
	}

	&:active {
		background: ${props => props.theme.colors.dark300};
	}
`

const Image = styled(Img)`
	width: 100%;
	height: 100%;
	border-radius: 8px;
`

export default function Profile() {
	const [expanded, setExpanded] = React.useState(false)

	const myAddress = useAddress()

	// const wallet = useWallet()
	const {wallet, disconnect, isWalletConnected} = useChain(CHAIN_NAME)

	const [nameServiceInfo] = useNameService([myAddress])

	// const { t } = useTranslation(['common'])

	const disconnectWallet = () => {
		disconnect()

		setExpanded(false)
	}

	const connectWallet = () => {
		NiceModal.show(ConnectWalletModal)

		setExpanded(false)
	}

	const viewMyProfile = React.useCallback(async () => {
		setExpanded(false)

		await asyncAction<ViewUserProfileResultProps>(
			NiceModal.show(ViewUserProfileModal, {
				user: nameServiceInfo,
			} as ViewUserProfileModalProps)
		)
	}, [nameServiceInfo])

	const viewMyCollections = async () => {
		setExpanded(false)

		await NiceModal.show(MyNFTsModal, {
			selectedNFTs: [],
			// title: t('common:my-nfts'),
			title: 'My NFTs',
			inViewMode: true,
		})
	}

	const publicName =
		nameServiceInfo?.extension?.publicName ?? nameServiceInfo?.extension?.name

	return (
		<Box sx={{ position: 'relative' }}>
			<Button
				onClick={() => setExpanded(prevExpanded => !prevExpanded)}
				variant='secondary'
				sx={{ padding: '6px', width: ['unset', '179px'] }}
			>
				<Flex sx={{ gap: ['2px', '8px'] }}>
					<Box
						sx={{
							width: '28px',
							height: '28px',
						}}
					>
						{nameServiceInfo?.extension?.image ? (
							<Image
								src={fromIPFSImageURLtoImageURL(nameServiceInfo?.extension?.image)}
							/>
						) : (
							<AvatarIcon width='100%' height='100%' />
						)}
					</Box>

					<Flex
						sx={{
							alignItems: 'flex-start',
							gap: '2px',
							flexDirection: 'column',
							width: ['unset', '107px'],
							overflow: 'hidden',
							display: ['none', 'flex'],
						}}
					>
						<OverflowTip>
							<ProfileTitle>{publicName ?? 
							// t('common:unnamed')
						'Unnamed'
						}
							</ProfileTitle>
						</OverflowTip>
						<ProfileAddress>
							{myAddress === NO_WALLET
								// ? t(`common:${NO_WALLET}`)
							? 'No Wallet'	
								: getShortText(myAddress, 6)}
						</ProfileAddress>
					</Flex>

					<Flex>{expanded ? <ChevronUpSmallIcon /> : <ChevronDownSmallIcon />}</Flex>
				</Flex>
			</Button>
			{expanded && (
				<>
					<Box
						sx={{
							position: ['fixed', 'absolute'],
							top: [`calc(${HEADER_HEIGHT} - 8px)`, 'unset'],
							left: [0, 'unset'],
							right: [0, 'unset'],
							width: ['unset', '179px', '179px'],
							margin: ['0 16px', '4px 0'],
							zIndex: 'headerPopup',
						}}
					>
						<DropdownContainer>
							{ isWalletConnected ? (
								<>
									<DropdownItem onClick={viewMyProfile}>
										{/* {t('common:profile.view-profile')} */}
										View Profile
									</DropdownItem>
									<DropdownItem onClick={viewMyCollections}>
										{/* {t('common:profile.my-nft-collections')} */}
										My NFT Collections
									</DropdownItem>
									<DropdownItem onClick={disconnectWallet}>
										{/* {t('common:profile.disconnect')} */}
										Disconnect
									</DropdownItem>
								</>
							) : (
								<>
									<DropdownItem onClick={connectWallet}>
										{/* {t('common:profile.connect')} */}
										Connect
									</DropdownItem>
								</>
							)}
						</DropdownContainer>
					</Box>
					<Box
						onClick={() => setExpanded(false)}
						sx={{
							position: ['fixed'],
							inset: 0,
							zIndex: 'headerPopupBackgroundOverlay',
						}}
					/>
				</>
			)}
		</Box>
	)
}
