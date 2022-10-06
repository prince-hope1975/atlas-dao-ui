import React from 'react'
import { useTranslation } from 'next-i18next'
import NiceModal from '@ebay/nice-modal-react'

import {
	AttributeCard,
	Button,
	Card,
	DescriptionCard,
	DescriptionCardItem,
	Loader,
} from 'components/ui'

import { makeStaticPaths, makeStaticProps } from 'lib'
import { Box, Flex } from 'theme-ui'
import moment from 'moment'

import { Row } from 'components/trade-listing-details'

import {
	ArrowLeftIcon,
	AvatarIcon,
	CalendarIcon,
	WalletIcon,
} from 'assets/icons/mixed'
import useHeaderActions from 'hooks/useHeaderActions'
import * as ROUTES from 'constants/routes'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { Coin, TradesService } from 'services/api/tradesService'
import { useWallet } from '@terra-money/use-wallet'
import { NFT } from 'services/api/walletNFTsService'
import { noop } from 'lodash'
import { SupportedCollectionsService } from 'services/api'
import { asyncAction } from 'utils/js/asyncAction'

import {
	DescriptionRow,
	ImageRow,
	LayoutContainer,
	ModalTitle,
	Page,
	theme,
	ViewNFTsModal,
	ViewNFTsModalProps,
	ViewNFTsModalResult,
} from 'components'
import NFTPreviewImages from 'components/shared/nft-preview-images/NFTPreviewImages'
import { TRADE, VERIFIED_COLLECTIONS } from 'constants/use-query-keys'
import CreateTradeListing from 'components/shared/header-actions/create-trade-listing/CreateTradeListing'

const getStaticProps = makeStaticProps(['common', 'trade-listings'])
const getStaticPaths = makeStaticPaths()

export { getStaticPaths, getStaticProps }

export default function TradeCounter() {
	const { t } = useTranslation(['common', 'trade-listings'])

	const route = useRouter()

	const wallet = useWallet()

	const { tradeId } = route.query ?? {}

	const { data: verifiedCollections } = useQuery(
		[VERIFIED_COLLECTIONS, wallet.network],
		async () =>
			SupportedCollectionsService.getSupportedCollections(wallet.network.name),
		{
			enabled: !!wallet.network,
			retry: true,
		}
	)

	const { data: trade, isLoading } = useQuery(
		[TRADE, tradeId, wallet.network],
		async () => TradesService.getTrade(wallet.network.name, tradeId as string),
		{
			enabled: !!wallet.network,
			retry: true,
		}
	)

	const { tradeInfo } = trade ?? {}
	const { additionalInfo, whitelistedUsers } = tradeInfo ?? {}

	const [tradePreview, setTradePreview] = React.useState<{
		coin?: Coin
		cw721Coin?: NFT
		cw1155Coin?: any
	} | null>(null)

	React.useEffect(() => {
		if (trade) {
			setTradePreview(additionalInfo?.tradePreview ?? null)
		}
	}, [trade])

	useHeaderActions(<CreateTradeListing />)

	const handleViewAllNFTs = async () => {
		if (!trade) {
			return
		}
		const [, result] = await asyncAction<ViewNFTsModalResult>(
			NiceModal.show(ViewNFTsModal, {
				nfts: (trade?.tradeInfo.associatedAssets ?? [])
					.filter(({ cw721Coin }) => cw721Coin)
					.map(({ cw721Coin }) => cw721Coin),
			} as ViewNFTsModalProps)
		)

		if (result) {
			setTradePreview(oldPrev => ({ ...oldPrev, cw721Coin: result.nft }))
		}
	}

	return (
		<Page title={t('title')}>
			<LayoutContainer>
				<Flex sx={{ flexDirection: 'column', mb: '48px' }}>
					{!isLoading ? (
						<>
							<Flex
								sx={{
									justifyContent: 'flex-start',
									padding: '22px 0',
								}}
							>
								<Button
									href={`${ROUTES.TRADE_LISTING_DETAILS}?tradeId=${tradeId}`}
									sx={{ height: '40px', padding: '13px' }}
									variant='secondary'
									startIcon={<ArrowLeftIcon />}
								>
									{t('trade-listings:back-to-listing')}
								</Button>
							</Flex>
							<Row>
								<ModalTitle>
									{t('trade-listings:trade-counter.submit-counter-offer')}
								</ModalTitle>
							</Row>

							<Card sx={{ flexDirection: 'column', p: '12px' }}>
								<Box sx={{ flex: 1 }}>
									<ImageRow
										nft={tradePreview?.cw721Coin}
										imageUrl={tradePreview?.cw721Coin?.imageUrl ?? []}
										onLike={noop}
										liked={false}
									/>

									<Row>
										<Button fullWidth variant='dark' onClick={handleViewAllNFTs}>
											<Flex sx={{ alignItems: 'center' }}>
												<NFTPreviewImages
													nfts={(tradeInfo?.associatedAssets ?? [])
														.filter(asset => asset.cw721Coin)
														.map(({ cw721Coin }) => cw721Coin as NFT)}
												/>
												<div>{t('trade-listings:view-all-nfts')}</div>
											</Flex>
										</Button>
									</Row>
								</Box>
								<Box sx={{ flex: 1 }}>
									<Row>
										<DescriptionRow
											name={tradePreview?.cw721Coin?.name}
											isPrivate={(whitelistedUsers ?? []).length > 0}
											collectionName={tradePreview?.cw721Coin?.collectionName ?? ''}
											verified={(verifiedCollections ?? []).some(
												({ collectionAddress }) =>
													tradePreview?.cw721Coin?.collectionAddress === collectionAddress
											)}
										/>
									</Row>
									{Boolean(tradePreview?.cw721Coin?.attributes?.length) && (
										<Row>
											<Flex sx={{ flexWrap: 'wrap', gap: '4.3px' }}>
												{(tradePreview?.cw721Coin?.attributes ?? []).map(attribute => (
													<AttributeCard
														key={JSON.stringify(attribute)}
														name={attribute.traitType}
														value={attribute.value}
													/>
												))}
											</Flex>
										</Row>
									)}
									<Row>
										<DescriptionCard>
											<DescriptionCardItem style={{ background: theme.colors.dark400 }}>
												<AvatarIcon />
												<Box sx={{ ml: '3px', flex: 1 }}>
													{`''${tradeInfo?.additionalInfo?.ownerComment?.comment ?? ''}''`}
												</Box>
											</DescriptionCardItem>
											<DescriptionCardItem style={{ background: theme.colors.dark400 }}>
												<WalletIcon
													width='20px'
													height='20px'
													color={theme.colors.gray1000}
												/>
												<Box
													sx={{
														ml: '9px',
														flex: 1,
													}}
												>
													{tradeInfo?.owner ?? ''}
												</Box>
											</DescriptionCardItem>
											<DescriptionCardItem style={{ background: theme.colors.dark400 }}>
												<CalendarIcon
													width='20px'
													height='20px'
													color={theme.colors.gray1000}
												/>
												<Box
													sx={{
														ml: '9px',
														flex: 1,
													}}
												>
													{t(`trade-listings:listed`, {
														listed: moment(tradeInfo?.additionalInfo?.time ?? '').fromNow(),
													})}
												</Box>
											</DescriptionCardItem>
										</DescriptionCard>
									</Row>
								</Box>
							</Card>
						</>
					) : (
						<Flex
							sx={{ height: '100vh', alignItems: 'center', justifyContent: 'center' }}
						>
							<Loader />
						</Flex>
					)}
				</Flex>
			</LayoutContainer>
		</Page>
	)
}