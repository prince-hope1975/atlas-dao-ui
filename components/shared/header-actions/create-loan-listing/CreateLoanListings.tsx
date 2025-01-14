import { CreateListingAddIcon } from '@/assets/icons/mixed'
import React from 'react'
import { Box, Flex } from 'theme-ui'
import * as ROUTES from '@/constants/routes'
// import { useTranslation } from 'next-i18next'
// import { useWallet, WalletStatus } from '@terra-money/wallet-kit'
import { LinkButton } from '@/components/link'
import { OverflowTip } from '@/components/ui'
import { Profile } from '../profile'
import { NotificationsBell } from '../notifications-bell'
import { useChain } from '@cosmos-kit/react'
import { CHAIN_NAME } from '@/utils/blockchain/networkUtils'

export default function CreateLoanListing() {
	// const { t } = useTranslation(['common'])
	const {status} = useChain(CHAIN_NAME)
	return (
		<Flex sx={{ gap: ['6px', '8px'] }}>
			<Profile />
			<NotificationsBell />
			{status === "Connected" && (
				<LinkButton
					variant='gradient'
					size='medium'
					href={ROUTES.LOAN_CREATE_LISTING}
					sx={{
						padding: ['11.75px', '10px 16px'],
					}}
				>
					<CreateListingAddIcon />
					<OverflowTip>
						<Box sx={{ display: ['none', 'block'], ml: '8px' }}>
							{/* {t('common:create-listing')} */}
							New Loan
						</Box>
					</OverflowTip>
				</LinkButton>
			)}
		</Flex>
	)
}
