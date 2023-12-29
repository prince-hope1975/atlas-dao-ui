import NiceModal, { useModal } from '@ebay/nice-modal-react'
import '@interchain-ui/react/styles'
// import { useWallet } from '@terra-money/wallet-kit'
import { useChain } from '@cosmos-kit/react'
import { Button, Modal } from '@/components/ui'
import { IconButton } from 'theme-ui'
import { ModalCloseIcon } from '@/assets/icons/modal'
import { ModalLayoutContainer } from '@/components/layout'
import { useTheme } from '@emotion/react'
// import { useTranslation } from 'next-i18next'
import {
	ModalBody,
	ModalContainer,
	ModalContent,
	ModalHeader,
	SectionCard,
} from './ConnectWalletModal.styled'
import { NETWORK_NAME } from '@/utils/blockchain/networkUtils'

export const ConnectWalletModal = NiceModal.create(() => {
	const { connect } = useChain(NETWORK_NAME)
	const modal = useModal()
	const theme = useTheme()
	// 	const { t } = useTranslation()

	return (
		<Modal isOverHeader isOpen={modal.visible} onCloseModal={modal.remove}>
			<ModalContainer>
				<ModalLayoutContainer>
					<ModalContent>
						<ModalHeader>
							{/* {t('common:connect-wallet')} */}
							Connect Wallet
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
							<SectionCard>

								<Button
									variant='primary'
									onClick={() => {
										connect()
										modal.remove()
									}}

								>
									Connect { }
								</Button>

							</SectionCard>
						</ModalBody>
					</ModalContent>
				</ModalLayoutContainer>
			</ModalContainer>
		</Modal>
	)
})
