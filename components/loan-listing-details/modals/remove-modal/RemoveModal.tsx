import React from 'react'
import { Box, Flex, IconButton } from 'theme-ui'
// import { useTranslation } from 'next-i18next'

import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTheme } from '@emotion/react'

import { ModalCloseIcon, ModalErrorCircleIcon } from '@/assets/icons/modal'

import {
	Button,
	Modal,
	RadioCardInput as RadioCard,
	RadioInputGroupProvider,
} from '@/components/ui'

import { ModalLayoutContainer } from '@/components/layout'
import {
	ModalBody,
	ModalContainer,
	ModalHeader,
	ModalContent,
	Title,
	Subtitle,
	RadioText,
} from './RemoveModal.styled'

export interface RemoveModalProps {
	loanId: string
}

enum CONFIRM_STATUS_TYPE {
	DEFAULT = '0',
	CONFIRMED = '1',
}

const RemoveModal = NiceModal.create(({ loanId }: RemoveModalProps) => {
	const [confirmStatus, setConfirmStatus] = React.useState(
		CONFIRM_STATUS_TYPE.DEFAULT
	)
	const modal = useModal()

	// const { t } = useTranslation(['common', 'loan-listings'])

	const theme = useTheme()

	const onRemove = () => {
		modal.resolve({ loanId })
		modal.remove()
	}

	return (
		<Modal isOverHeader isOpen={modal.visible} onCloseModal={modal.remove}>
			<ModalContainer>
				<ModalLayoutContainer>
					<ModalContent>
						<ModalHeader>
							{/* {t('loan-listings:remove-modal.title')} */}
							Remove Listing
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
							<ModalBody>
								<Flex sx={{ gap: '8px' }}>
									<Box sx={{ width: '32px', height: '32px' }}>
										<ModalErrorCircleIcon />
									</Box>
									<Flex sx={{ flex: 1, flexDirection: 'column' }}>
										<Title>
{/* {t('loan-listings:remove-modal.question')} */}
Are you sure you’d like to remove this listing?
</Title>
										<Subtitle>
											{/* {t('loan-listings:remove-modal.answer')} */}
											This action cannot be undone and you will lose any current counter offers! To proceed with the removal, make a selection below.	
											</Subtitle>
									</Flex>
								</Flex>
								<RadioInputGroupProvider
									name='confirmStatus'
									value={confirmStatus}
									onChange={e => setConfirmStatus(e.target.value as CONFIRM_STATUS_TYPE)}
								>
									<RadioCard value={CONFIRM_STATUS_TYPE.CONFIRMED}>
										<RadioText>
											{/* {t('loan-listings:remove-modal.radio-text')} */}
											Yes, I’m absolutely sure. Please remove my listing!	
											</RadioText>
									</RadioCard>
								</RadioInputGroupProvider>
								<Flex
									sx={{
										justifyContent: 'space-between',
										gap: '12px',
										marginTop: '24px',
									}}
								>
									<Button variant='secondary' fullWidth onClick={modal.remove}>
										{/* {t('loan-listings:remove-modal.back-to-listing')} */}
										Back to Listing
									</Button>
									<Button
										variant='destructive'
										fullWidth
										disabled={confirmStatus === CONFIRM_STATUS_TYPE.DEFAULT}
										onClick={onRemove}
									>
										{/* {t('loan-listings:remove-modal.remove-listing')} */}
										Remove Listing
									</Button>
								</Flex>
							</ModalBody>
						</ModalBody>
					</ModalContent>
				</ModalLayoutContainer>
			</ModalContainer>
		</Modal>
	)
})
export default RemoveModal
