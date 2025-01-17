import NiceModal from '@ebay/nice-modal-react'
import EmptyBox from '@/assets/images/EmptyBox'
import { LinkButton } from '@/components/link'
import React from 'react'
import { Box, Flex } from 'theme-ui'
import * as ROUTES from '@/constants/routes'

import {
	Accordion,
	AccordionTitle,
	Button,
	Loader,
	MultiSelectAccordionInput,
	Pagination,
} from '@/components/ui'
import { CollectionsBoxesIcon, TargetIcon } from '@/assets/icons/mixed'
import { NFT } from '@/services/api/walletNFTsService'
// import { useTranslation } from 'next-i18next'
import { LATEST_BLOCK, VERIFIED_COLLECTIONS } from '@/constants/useQueryKeys'
// import { useWallet, WalletStatus } from '@terra-money/wallet-kit'
import { SupportedCollectionsService } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { MultiSelectAccordionInputOption } from '../ui/multi-select-accordion-input/MultiSelectAccordionInput'
import { LoansResponse, LOAN_STATE } from '@/services/api/loansService'
import { BLOCKS_PER_DAY } from '@/constants/core'
import { calculateRangePercentage } from '@/utils/js/calculateRangePercentage'
import networkUtils, { getNetworkName } from '@/utils/blockchain/networkUtils'
import { ConnectWalletModal } from '../shared/modals/connect-wallet-modal/ConnectWalletModal'
import LoanOfferCard from './LoanOfferCard'
import {
	AccordionContentWrapper,
	ActivityCard,
	ActivityCardEmptyContainer,
	ActivityCardEmptyTitle,
	ActivityLoadingContainer,
	SectionTitle,
} from './styled'

interface LoanOffersProps {
	allLoans?: LoansResponse
	refetch: () => void
	isLoading: boolean
	loans?: LoansResponse
	page: number
	setPage: React.Dispatch<React.SetStateAction<number>>
	statuses: MultiSelectAccordionInputOption[]
	setStatuses: React.Dispatch<
		React.SetStateAction<MultiSelectAccordionInputOption[]>
	>
	collections: MultiSelectAccordionInputOption[]
	setCollections: React.Dispatch<
		React.SetStateAction<MultiSelectAccordionInputOption[]>
	>
	statusOptions: MultiSelectAccordionInputOption[]
	loansFetched: boolean
}

function LoanOffers({
	isLoading,
	allLoans,
	loansFetched,
	refetch,
	page,
	setPage,
	loans,
	statuses,
	setStatuses,
	collections,
	setCollections,
	statusOptions,
}: LoanOffersProps) {
	// const { t } = useTranslation()
	// const wallet = useWallet()
	const networkName = getNetworkName()

	const { data: verifiedCollections } = useQuery(
		[VERIFIED_COLLECTIONS, networkName],
		async () => SupportedCollectionsService.getSupportedCollections(networkName),
		{
			retry: true,
		}
	)

	const { data: latestBlockHeight } = useQuery(
		[LATEST_BLOCK, networkName],
		async () => networkUtils.getLatestBlockHeight(),
		{
			retry: true,
			refetchInterval: 60 * 1000,
		}
	)

	const connectWallet = () => {
		NiceModal.show(ConnectWalletModal)
	}

	return (
		<Flex sx={{ flexDirection: 'column', gap: '24px', pb: '48px' }}>
		{/* {t('dashboard:loans:title')} */}
			<SectionTitle>Loans</SectionTitle>

			{!allLoans?.total && loansFetched ? (
				<ActivityCard>
					<ActivityCardEmptyContainer>
						<EmptyBox />

						<Box sx={{ maxWidth: '524px' }}>
							<ActivityCardEmptyTitle>
								{/* {t('dashboard:loans:no-offers')} */}
								You {"don't"} have any offers yet.
								<br />
								{/* {t('dashboard:loans:make-offer-to-appear')} */}
								Make an offer on a trade for it to appear here.
							</ActivityCardEmptyTitle>
						</Box>

						{status === 'Disconnected' ? (
							<Button onClick={connectWallet} variant='gradient' size='large'>
								{/* {t('common:connect-wallet')} */}
								Connect Wallet
							</Button>
						) : (
							<LinkButton href={ROUTES.LOAN_LISTINGS} variant='gradient' size='large'>
								{/* {t('dashboard:loans:explore-listings')} */}
								Explore Loan Listings
							</LinkButton>
						)}
					</ActivityCardEmptyContainer>
				</ActivityCard>
			) : (
				<Flex
					sx={{
						flexDirection: ['column'],
						alignItems: 'center',
						minHeight: '960px',
						pb: ['47px'],
					}}
				>
					<Flex
						sx={{
							flex: [null, null, 1],
							width: '100%',
							flexDirection: ['column', 'column', 'row'],
							gap: ['12px', '12px', '24px'],
						}}
					>
						<Flex
							sx={{
								flex: 1,
								flexDirection: ['column', 'row', 'column'],
								maxWidth: [null, null, '308px'],
								gap: [null, '8px', null],
							}}
						>
							<Box sx={{ flex: [null, 1, 'unset'] }}>
								<Accordion
									icon={<TargetIcon />}
									title={
										<AccordionTitle>
											{/* {t('dashboard:loans:filters:status-label')} */}
											Status
										</AccordionTitle>
									}
								>
									<AccordionContentWrapper>
										<MultiSelectAccordionInput
											value={statuses}
											onChange={v => setStatuses(v)}
											// accordionTitle={t('dashboard:loans:filters:status-label')}
											accordionTitle="Status"
											options={statusOptions}
										/>
									</AccordionContentWrapper>
								</Accordion>
							</Box>
							<Box sx={{ flex: [null, 1, 'unset'] }}>
								<Accordion
									icon={<CollectionsBoxesIcon />}
									title={
										<AccordionTitle>
											{/* {t('dashboard:loans:filters:collections-label')} */}
											Collections
										</AccordionTitle>
									}
								>
									<AccordionContentWrapper>
										<MultiSelectAccordionInput
											value={collections}
											onChange={v => setCollections(v)}
											// accordionTitle={t(
											// 	'dashboard:loans:filters:nft-collections-search-label'
											// )}
											accordionTitle="NFT Collection"
											options={(verifiedCollections ?? [])?.map(
												({ collectionAddress, collectionName }) => ({
													label: collectionName,
													value: collectionAddress,
												})
											)}
											// placeholder={t(
											// 	'dashboard:loans:filters:search-collections-placeholder'
											// )}
											placeholder="Search Collections..."
										/>
									</AccordionContentWrapper>
								</Accordion>
							</Box>
						</Flex>

						<Flex
							sx={{
								flexDirection: 'column',
								flex: 1,
								justifyContent: 'flex-start',
								alignItems: 'center',
							}}
						>
							<Box
								sx={{
									display: 'grid',
									width: ['100%'],
									overflow: 'auto',
									gridTemplateColumns: '1fr',
									gridColumnGap: ['16px', '25px', '14px'],
									gridRowGap: ['8px', '16px', '18px'],
								}}
							>
								{isLoading && (
									<ActivityLoadingContainer>
										<Loader />
									</ActivityLoadingContainer>
								)}
								{!isLoading &&
									(loans?.data ?? []).map(loan => {
										const {
											loanId,
											borrower,
											loanInfo: {
												loanPreview,
												associatedAssets,
												activeOffer,
												state,
												terms,
												startBlock,
											},
										} = loan

										const defaultBlock =
											(startBlock ?? 0) +
											(activeOffer?.offerInfo?.terms?.durationInBlocks ?? 0)

										return (
											<Box key={`${loanId}_${borrower}`}>
												<LoanOfferCard
													state={state}
													description={loanPreview?.cw721Coin?.description ?? ''}
													attributes={loanPreview?.cw721Coin?.attributes ?? []}
													tokenId={loanPreview?.cw721Coin?.tokenId ?? ''}
													collectionAddress={loanPreview?.cw721Coin?.collectionAddress ?? ''}
													href={`${ROUTES.LOAN_LISTING_DETAILS}?loanId=${loanId}&borrower=${borrower}`}
													nfts={(associatedAssets || [])
														.filter(nft => nft.cw721Coin)
														.map(({ cw721Coin }) => cw721Coin as NFT)}
													id={loanPreview?.cw721Coin?.id ?? []}
													name={loanPreview?.cw721Coin?.name ?? ''}
													apr={Number(
														activeOffer?.offerInfo?.terms?.interestRate ??
															terms?.interestRate ??
															0
													)}
													borrowAmount={Number(
														activeOffer?.offerInfo?.terms?.principle?.amount ??
															terms?.principle.amount ??
															0
													)}
													timeFrame={Math.floor(
														Number(
															(activeOffer?.offerInfo?.terms?.durationInBlocks ??
																terms?.durationInBlocks) / BLOCKS_PER_DAY
														)
													)}
													verified={(verifiedCollections ?? []).some(
														({ collectionAddress }) =>
															loanPreview?.cw721Coin?.collectionAddress === collectionAddress
													)}
													defaultPercentage={
														startBlock
															? calculateRangePercentage(
																	Number(latestBlockHeight) ?? 0,
																	startBlock ?? 0,
																	defaultBlock ?? 0
															  )
															: 0
													}
													daysUntilDefault={
														[LOAN_STATE.Started].includes(state)
															? (
																	((startBlock ?? 0) +
																		(activeOffer?.offerInfo?.terms?.durationInBlocks ?? 0) -
																		(Number(latestBlockHeight) ?? 0)) /
																	BLOCKS_PER_DAY
															  ).toFixed(2)
															: undefined
													}
													defaultThreshold={90}
													refetchLoan={refetch}
													loan={loan}
													collectionName={loanPreview?.cw721Coin?.collectionName || ''}
												/>
											</Box>
										)
									})}
							</Box>
							<Box sx={{ mt: 'auto', pt: '24px' }}>
								<Pagination
									currentPage={page}
									pageCount={loans?.pageCount}
									setPage={setPage}
								/>
							</Box>
						</Flex>
					</Flex>
				</Flex>
			)}
		</Flex>
	)
}

LoanOffers.defaultProps = {
	allLoans: undefined,
	loans: undefined,
}

export default LoanOffers
