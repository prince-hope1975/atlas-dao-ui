import { useTheme } from '@emotion/react'
import { WalletIcon } from '../../assets/icons/mixed'
import TradeAssetImage from '../../assets/images/TradeAsset'
import { Button, Card } from '../../components/ui'
import useAddress from '../../hooks/useAddress'
// import { useTranslation } from 'next-i18next'
import React from 'react'
import { Box, Flex } from 'theme-ui'
import NiceModal from '@ebay/nice-modal-react'
import { asyncAction } from '../../utils/js/asyncAction'
import { MyNFTsModal } from '../shared'
import { NFT } from '../../services/api/walletNFTsService'
import { useFormContext } from 'react-hook-form'
import ImagePlaceholder from '../../assets/images/ImagePlaceholder'
import { TextAreaField, TokenInputField } from '../form'
import {
	AttributeCard,
	AttributeName,
	AttributeValue,
	Grid,
	PreviewImage,
	PreviewImageContainer,
	SelectNFTsSection,
	Title,
} from './styled'

export default function SelectNFTs() {
	const theme = useTheme()
	// const { t } = useTranslation(['common', 'trade-listings'])
	const myAddress = useAddress()
	const {
		setValue,
		getValues,
		register,
		watch,
		formState: { isValid, errors },
		trigger,
	} = useFormContext()

	const handleSelectMyNFTs = async () => {
		const [, NFTs] = await asyncAction<NFT[]>(
			NiceModal.show(MyNFTsModal, {
				selectedNFTs: getValues('selectedNFTs'),
				title: "My NFTs",// t('common:my-nfts'),
				addNFTsButtonLabel: "Add NFTs to offer"// t('common:add-nfts-to-offer'),
			})
		)

		if (NFTs) {
			setValue('selectedNFTs', NFTs)
			trigger('selectedNFTs')
		}
	}

	return (
		<Card sx={{ flexDirection: 'column', p: '12px', gap: '16px' }}>
			<AttributeCard>
				<Box sx={{ width: '100%' }}>
					<AttributeName>
						{/* {t('trade-listings:trade-counter.you-offer-as')} */}
						You offer as
					</AttributeName>
					<AttributeValue>
						<WalletIcon width='20px' height='20px' color={theme.colors.gray1000} />
						<Box
							sx={{
								ml: '9px',
								flex: 1,
							}}
						>
							{myAddress ?? ''}
						</Box>
					</AttributeValue>
				</Box>
			</AttributeCard>
			<SelectNFTsSection>
				{watch('selectedNFTs').length ? (
					<Flex sx={{ width: '100%', flexDirection: 'column' }}>
						<Flex
							sx={{
								width: '100%',
								justifyContent: 'space-between',
							}}
						>
							<Flex sx={{ alignSelf: 'flex-start', flexDirection: 'column', flex: 1 }}>
								<Flex sx={{}}>
									<Title>
										{/* {t('trade-listings:trade-counter.selected-nfts')} */}
										Selected NFTs
										</Title>
								</Flex>
								{/* <Box sx={{ mt: 2, alignSelf: 'flex-start' }}>
									<Subtitle>
										{t(
											'trade-listings:trade-counter.explain-what-sets-you-and-your-nfts-apart'
										)}
									</Subtitle>
								</Box> */}
							</Flex>
							<Flex sx={{ marginLeft: 'auto', alignItems: 'center' }}>
								<Button onClick={handleSelectMyNFTs} variant='dark'>
									{/* {t('trade-listings:trade-counter.select-more')} */}


								</Button>
							</Flex>
						</Flex>
						<Box>
							<Grid>
								{watch('selectedNFTs').map(nft => (
									<PreviewImageContainer key={`${nft.collectionAddress}_${nft.tokenId}`}>
										{nft?.imageUrl?.every(img => img === '') ? (
											<Flex sx={{ maxWidth: '61px', maxHeight: '61px' }}>
												<ImagePlaceholder width='100%' height='100%' />
											</Flex>
										) : (
											<PreviewImage src={nft?.imageUrl ?? []} />
										)}
									</PreviewImageContainer>
								))}
							</Grid>
						</Box>
					</Flex>
				) : (
					<>
						<TradeAssetImage height='99.84px' width='91.59px' />
						<Box sx={{ textAlign: 'center' }}>
							<Title>
								{/* {t('trade-listings:trade-counter.select-at-least-one-item')} */}
								Select at least one item
							</Title>
						</Box>
						{/* <Box sx={{ mt: 2, textAlign: 'center' }}>
							<Subtitle>
								{t(
									'trade-listings:trade-counter.explain-what-sets-you-and-your-nfts-apart'
								)}
							</Subtitle>
						</Box> */}

						<Box sx={{ mt: 10 }}>
							<Button
								onClick={handleSelectMyNFTs}
								sx={{ minWidth: ['140px'] }}
								variant='gradient'
							>
								{/* {t('trade-listings:trade-counter.pick-nfts')} */}
								Pick NFTs
							</Button>
						</Box>
					</>
				)}
			</SelectNFTsSection>

			<Box>
				<TokenInputField
					label="Token I&apos;d like to offer" //{t('trade-listings:trade-counter.tokens-i-would-like-to-offer')}
					id='tokenAmount'
					{...register('tokenAmount')}
					placeholder={getValues('tokenName')}
					// {t('trade-listings:trade-counter.enter-amount', {
					// 	currency: getValues('tokenName'),
					// })}
					fieldError={
						errors.tokenAmount && errors.tokenAmount.message
						// t(`common:errors.${errors.tokenAmount.message}`)
					}
					error={!!errors.tokenAmount}
					tokenName={getValues('tokenName')}
				/>

				<Flex sx={{ flexDirection: 'column' }}>
					<TextAreaField
						label="Write a comment"  // {t('trade-listings:trade-counter.write-a-comment')}
						id='comment'
						style={{ height: '128px' }}
						{...register('comment')}
						placeholder="Enter text" // {t('trade-listings:trade-counter.enter-text')}
					/>
				</Flex>
			</Box>

			<Button
				disabled={!isValid}
				type='submit'
				variant='gradient'
				size='extraLarge'
			>
				{/* {t('trade-listings:trade-counter.review-offer')} */}
				Review Offer
			</Button>
		</Card>
	)
}
