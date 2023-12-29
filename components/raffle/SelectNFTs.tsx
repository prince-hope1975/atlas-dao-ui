// import { useTranslation } from 'next-i18next'
import { useFormContext } from 'react-hook-form'
import { Box, Flex, Text } from 'theme-ui'
import NiceModal from '@ebay/nice-modal-react'
import TradeAssetImage from '../../assets/images/TradeAsset'
import { MyNFTsModal } from '../shared/modals/my-nfts-modal'
import { NFT } from '../../services/api/walletNFTsService'
import { asyncAction } from '../../utils/js/asyncAction'
import { MyNFTsModalProps } from '../shared/modals/my-nfts-modal/MyNFTsModal'
import { TradeFormStepsProps } from '../../types'
import { NavigationFooter } from '../shared/navigation-footer'
import { Button } from '../ui'
import { NFTCard } from '../shared'
import {
	ContentCard,
	ContentCardSubtitle,
	ContentCardTitle,
	ContentCardTitleChip,
	ListOfSelectedNFTsCard,
	ListOfSelectedNFTsHeader,
	NFTCardsContainer,
	TradeAssetImageContainer,
} from './SelectNFTs.styled'

interface ListOfSelectedNFTsProps {
	goNextStep: () => void
	goBackStep: () => void
}

const ListOfSelectedNFTs = ({
	goBackStep,
	goNextStep,
}: ListOfSelectedNFTsProps) => {
	const { setValue, getValues, watch } = useFormContext<TradeFormStepsProps>()
	// const { t } = useTranslation(['common', 'raffle'])
	const selectedCoverNFT = watch('coverNFT') || getValues('selectedNFTs')[0]

	return (
		<Flex sx={{ flexDirection: 'column', flex: 1 }}>
			<ListOfSelectedNFTsCard>
				<ListOfSelectedNFTsHeader>
					<div>
						<ContentCardTitle sx={{ textAlign: 'left' }}>
							{/* {t('raffle:select-NFTs.selected-nfts')} */}
							Selected NFT&apos;s
							<ContentCardTitleChip>
								{/* {t('common:nft', { count: getValues('selectedNFTs').length })} */}
								{getValues('selectedNFTs').length}
							</ContentCardTitleChip>
						</ContentCardTitle>
						<ContentCardSubtitle sx={{ textAlign: 'left' }}>
							{t('raffle:select-NFTs.selected-nfts-description')}
						</ContentCardSubtitle>
					</div>
					<Button
						sx={{
							marginLeft: [null, 'auto'],
							marginTop: ['8px', '0px'],
						}}
						variant='dark'
						onClick={async e => {
							e.preventDefault()

							const [, NFTs] = await asyncAction<NFT[]>(
								NiceModal.show(MyNFTsModal, {
									selectedNFTs: getValues('selectedNFTs'),
									title: t('common:my-nfts'),
									addNFTsButtonLabel: t('raffle:select-NFTs.add-nfts-to-raffle'),
								} as MyNFTsModalProps)
							)

							if (NFTs) {
								const [defaultCoverNFT] = NFTs
								setValue('selectedNFTs', NFTs)
								setValue('coverNFT', defaultCoverNFT)
							}
						}}
					>
						{/* {t('common:buttons.select-more')} */}
						Select More
					</Button>
				</ListOfSelectedNFTsHeader>
				<NFTCardsContainer>
					{getValues('selectedNFTs').map(selectedNFT => {
						return (
							<NFTCard
								key={`${selectedNFT.collectionAddress}_${selectedNFT.tokenId}`}
								{...selectedNFT}
								size='small'
								isCover={
									`${selectedNFT.collectionAddress}_${selectedNFT.tokenId}` ===
									`${selectedCoverNFT.collectionAddress}_${selectedCoverNFT.tokenId}`
								}
								hasCoverSelector
								onCardClick={() => setValue('coverNFT', selectedNFT)}
							/>
						)
					})}
				</NFTCardsContainer>
			</ListOfSelectedNFTsCard>
			{/* Footer Navigation Section */}
			<NavigationFooter
				goBackStep={goBackStep}
				goNextStep={goNextStep}
				isBackButtonDisabled
			/>
		</Flex>
	)
}

const SelectNFTsEmpty = () => {
	// const { t } = useTranslation(['common', 'raffle'])
	const { setValue, getValues } = useFormContext<TradeFormStepsProps>()

	return (
		<ContentCard>
			<TradeAssetImageContainer>
				<TradeAssetImage />
			</TradeAssetImageContainer>

			<Box sx={{ mb: ['2px'] }}>
				<ContentCardTitle>
					{/* {t('raffle:select-NFTs:question')} */}
					Which NFTs are you looking to raffle
					</ContentCardTitle>
			</Box>
			<Box sx={{ mb: ['16px'] }}>
				<ContentCardSubtitle>
					{/* {t('raffle:select-NFTs:add-instruction')} */}
					Add them here by clicking below
				</ContentCardSubtitle>
			</Box>

			<Button
				sx={{ minWidth: ['140px'] }}
				onClick={async e => {
					e.preventDefault()
					const [, NFTs] = await asyncAction<NFT[]>(
						NiceModal.show(MyNFTsModal, {
							selectedNFTs: getValues('selectedNFTs'),
							title:'My NFTs', // t('common:my-nfts'),
							addNFTsButtonLabel: 'Add NFTs to Raffle' // t('raffle:select-NFTs.add-nfts-to-raffle'),
						} as MyNFTsModalProps)
					)

					if (NFTs) {
						const [defaultCoverNFT] = NFTs
						setValue('selectedNFTs', NFTs)
						setValue('coverNFT', defaultCoverNFT)
					}
				}}
				fullWidth
				variant='gradient'
			>
				<Text variant='textSmMedium'>
					{/* {t('raffle:select-NFTs.select-nfts')} */}
					Select NFTs
					</Text>
			</Button>
		</ContentCard>
	)
}

interface Props {
	goNextStep: () => void
	goBackStep: () => void
}

export const SelectNFTs = ({ goNextStep, goBackStep }: Props) => {
	const { watch } = useFormContext<TradeFormStepsProps>()
	const watchSelectedNFTs = watch('selectedNFTs')

	return watchSelectedNFTs.length === 0 ? (
		<SelectNFTsEmpty />
	) : (
		<ListOfSelectedNFTs goBackStep={goBackStep} goNextStep={goNextStep} />
	)
}
