import useMyNFTs from 'hooks/useMyNFTs'
import { noop, uniqBy } from 'lodash'
import React from 'react'
import { NFT } from 'services/api/walletNFTsService'
// import { Flex, Box } from 'theme-ui'
// import { Button } from '../button'
// import { OnlyMobileAndTablet } from '../layout'
import { Modal } from '../modal'
import { ModalProps } from '../modal/Modal'
import NFTCard from '../nft-card/NFTCard'
import { SelectCard } from '../select-card'
import {
	CollectionFiltersSection,
	ModalBody,
	NFTCardContainer,
	NFTCardsGridWrapper,
	NFTSelectionOverlay,
	// SearchContainer,
	// SortSelectContainer,
} from './MyNFTsModal.styled'

interface MyNFTsModalProps extends ModalProps {
	title?: string
	addNFTsButtonLabel?: string
	selectedNFTs?: NFT[]
	onAddNFTs?: (v: NFT[]) => void
}

function MyNFTsModal({
	isActive,
	closeModal,
	// onAddNFTs,
	// title,
	// addNFTsButtonLabel,
	selectedNFTs: defaultSelectedNFTs = [],
}: MyNFTsModalProps) {
	const { ownedNFTs } = useMyNFTs()
	const [selectedNFTs, setSelectedNFTs] =
		React.useState<NFT[]>(defaultSelectedNFTs)

	React.useEffect(() => {
		setSelectedNFTs(defaultSelectedNFTs)
	}, [defaultSelectedNFTs, isActive])

	const addSelectedNFT = (nft: NFT) => {
		setSelectedNFTs(prevState =>
			uniqBy(
				[...prevState, nft],
				({ collectionAddress, tokenId }) => `${collectionAddress}_${tokenId}`
			)
		)
	}

	const removeSelectedNFT = (nft: NFT) => {
		setSelectedNFTs(prevState =>
			prevState.filter(
				({ collectionAddress, tokenId }) =>
					!(collectionAddress === nft.collectionAddress && tokenId === nft.tokenId)
			)
		)
	}

	return (
		<Modal
			// headerRightActionComponent={
			// 	<Button
			// 		variant='gradient'
			// 		sx={{ display: ['none', 'none', 'flex'], p: '10px 16px', fontWeight: 400 }}
			// 		fullWidth
			// 		disabled={!selectedNFTs.length}
			// 		onClick={() => onAddNFTs?.(selectedNFTs)}
			// 	>
			// 		{addNFTsButtonLabel}
			// 	</Button>
			// }
			// headerExtraContentComponent={
			// 	<Box sx={{ marginTop: ['16px', '32px'] }}>
			// 		<Flex sx={{ height: ['48px'], gap: '12px' }}>
			// 			<SearchContainer />
			// 			<SortSelectContainer />
			// 		</Flex>
			// 		<OnlyMobileAndTablet>
			// 			<Box sx={{ height: ['8px'] }} />
			// 			<Flex sx={{ height: ['50px'], gap: 10 }}>
			// 				<Box sx={{ flex: 1, bg: 'pink' }} />
			// 				<Box sx={{ flex: 1, bg: 'red' }} />
			// 			</Flex>
			// 		</OnlyMobileAndTablet>
			// 		<Flex sx={{ mt: ['8px'], display: ['flex', 'flex', 'none'] }}>
			// 			<Button
			// 				variant='gradient'
			// 				sx={{ p: '12px 0', fontWeight: 400 }}
			// 				fullWidth
			// 				disabled={!selectedNFTs.length}
			// 				onClick={() => onAddNFTs?.(selectedNFTs)}
			// 			>
			// 				{addNFTsButtonLabel}
			// 			</Button>
			// 		</Flex>
			// 	</Box>
			// }
			closeModal={closeModal}
			// title={title}
			isActive={isActive}
		>
			<ModalBody>
				<CollectionFiltersSection />
				<NFTCardsGridWrapper>
					<NFTCardContainer>
						{ownedNFTs.map(nft => {
							const checked = selectedNFTs.some(
								({ collectionAddress, tokenId }) =>
									collectionAddress === nft.collectionAddress && tokenId === nft.tokenId
							)

							return (
								<NFTCard
									{...nft}
									key={`${nft.collectionAddress}_${nft.tokenId}`}
									onClick={() =>
										checked ? removeSelectedNFT(nft) : addSelectedNFT(nft)
									}
									checked={checked}
								/>
							)
						})}
					</NFTCardContainer>
				</NFTCardsGridWrapper>
			</ModalBody>

			{selectedNFTs.length > 0 && (
				<NFTSelectionOverlay>
					<SelectCard
						sx={{ maxWidth: '424px' }}
						items={selectedNFTs}
						onRemove={removeSelectedNFT}
					/>
				</NFTSelectionOverlay>
			)}
		</Modal>
	)
}

MyNFTsModal.defaultProps = {
	title: 'My NFTs',
	addNFTsButtonLabel: 'Add NFTs to Trade',
	selectedNFTs: [],
	onAddNFTs: noop,
}

export default MyNFTsModal
