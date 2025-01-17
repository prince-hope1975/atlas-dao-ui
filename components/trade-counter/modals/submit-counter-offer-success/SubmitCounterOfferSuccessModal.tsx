import React from 'react'
import { Box, Flex, IconButton } from 'theme-ui'
// import { useTranslation } from 'next-i18next'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTheme } from '@emotion/react'

import { ModalCloseIcon, ModalSuccessCircleIcon } from '../../../../assets/icons/modal'

import { Button, Modal } from '../../../../components/ui'

import * as ROUTES from '../../../../constants/routes'
import { useRouter } from 'next/router'
import getShortText from '../../../../utils/js/getShortText'
import { ModalLayoutContainer } from '../../../../components/layout'
import { Trade } from '../../../../services/api/tradesService'
import {
	ModalBody,
	ModalContainer,
	ModalHeader,
	ModalContent,
	Title,
	Subtitle,
} from './SubmitCounterOfferSuccessModal.styled'

export interface SubmitCounterOfferSuccessModalProps {
	trade: Trade
}
const SubmitCounterOfferSuccessModal = NiceModal.create(
	({ trade }: SubmitCounterOfferSuccessModalProps) => {
		const modal = useModal()

		// const { t } = useTranslation(['common', 'trade-listings'])

		const theme = useTheme()

		const router = useRouter()

		return (
			<Modal isOverHeader isOpen={modal.visible} onCloseModal={modal.remove}>
				<ModalContainer>
					<ModalLayoutContainer>
						<ModalContent>
							<ModalHeader>
								{/* {t('trade-listings:submit-counter-offer-success-modal.title')} */}
								Submit counter offer
								<IconButton
									sx={{
										borderRadius: '32px',
										backgroundColor: theme.colors.dark500,
									}}
									onClick={modal.remove}
								>
									<ModalCloseIcon />
								</IconButton>
							</ModalHeader>
							<ModalBody>
								<Flex sx={{ gap: '8px' }}>
									<Box sx={{ minWidth: '32px', minHeight: '32px' }}>
										<ModalSuccessCircleIcon />
									</Box>
									<Box>
										<Title>
											{/* {t('trade-listings:submit-counter-offer-success-modal.question', {
												username: getShortText(trade?.tradeInfo?.owner ?? '', 8),
											})} */}
											{getShortText(trade?.tradeInfo?.owner ?? '', 8)}
										</Title>
										<Subtitle>
											{/* {t('trade-listings:submit-counter-offer-success-modal.note')} */}
											We&apos;ve sent them a message, so hang tight as they take a look.
										</Subtitle>
									</Box>
								</Flex>
								<Box />
								<Flex
									sx={{
										justifyContent: 'space-between',
										gap: '12px',
										marginTop: '24px',
									}}
								>
									<Button
										variant='secondary'
										fullWidth
										onClick={() => {
											router.push(ROUTES.TRADE_LISTINGS)
											modal.remove()
										}}
									>
										{/* {t(
											'trade-listings:submit-counter-offer-success-modal.view-all-listings'
										)} */}
										View All Listings
									</Button>
									<Button
										variant='gradient'
										fullWidth
										onClick={() => {
											router.push(
												`${ROUTES.TRADE_LISTING_DETAILS}?tradeId=${trade.tradeId}`
											)
											modal.remove()
										}}
									>
										{/* {t('trade-listings:submit-counter-offer-success-modal.go-to-listing')} */}
									Go To Listing
									</Button>
								</Flex>
							</ModalBody>
						</ModalContent>
					</ModalLayoutContainer>
				</ModalContainer>
			</Modal>
		)
	}
)
export default SubmitCounterOfferSuccessModal
