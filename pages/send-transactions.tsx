import React from 'react'
// import { useTranslation } from 'next-i18next'
import { Box, Flex } from 'theme-ui'

import AirdropperImg from '../assets/images/AirdropperImg'
import MultisenderImg from '../assets/images/MultisenderImg'
import {
	CardSubtitle,
	SendingCard,
	SendTransactionsTable,
	Title,
} from '../components/send-transactions'
// import { makeStaticPaths, makeStaticProps } from 'lib'
import * as ROUTES from '../constants/routes'
import { SEND_TYPE } from '../constants/sendTypes'
import { LinkButton } from '../components/link'
import { LayoutContainer, Page } from '../components/layout'

// const getStaticProps = makeStaticProps(['common', 'send-transactions'])
// const getStaticPaths = makeStaticPaths()
// export { getStaticPaths, getStaticProps }

export default function SendTransactions() {
	// const { t } = useTranslation(['common', 'send-transactions'])

	return (
		<Page title="Title" //{t('common:title')}
		>
			<LayoutContainer>
				<Box sx={{ mt: ['14px', '32px'] }}>
					<Title>
						{/* {t('send-transactions:start-sending')} */}
						Start Sending
						</Title>
				</Box>
				<Flex
					sx={{
						flexDirection: ['column', 'column', 'row'],
						mt: ['8px'],
						gap: ['16px', '24px'],
					}}
				>
					<SendingCard>
						<MultisenderImg width={263} height={182} />
						<Box sx={{ mt: '8px' }}>
							<Title>
								{/* {t('send-transactions:nft-multisender')} */}
								NFT Multisender
								</Title>
						</Box>
						<Box sx={{ mt: '8px' }}>
							<CardSubtitle>
								{/* {t('send-transactions:nft-multisender-description')} */}
								Send many NFTs to one or more wallet addresses. Get started by clicking below.
							</CardSubtitle>
						</Box>
						<Flex sx={{ mt: '16px', width: '128px' }}>
							<LinkButton
								href={`${ROUTES.SEND}?type=${SEND_TYPE.MULTI_SEND_TYPE}`}
								fullWidth
								variant='gradient'
							>
								{/* {t('send-transactions:multisend')} */}
								Multisend
							</LinkButton>
						</Flex>
					</SendingCard>
					<SendingCard>
						<AirdropperImg width={263} height={182} />
						<Box sx={{ mt: '8px' }}>
							<Title>
								{/* {t('send-transactions:nft-airdropper')} */}
								NFT Airdropper
							</Title>
						</Box>
						<Box sx={{ mt: '8px' }}>
							<CardSubtitle>
								{/* {t('send-transactions:nft-airdropper-description')} */}
							</CardSubtitle>
						</Box>

						<Flex sx={{ mt: '16px', width: '128px' }}>
							<LinkButton
								href={`${ROUTES.SEND}?type=${SEND_TYPE.AIRDROP_TYPE}`}
								fullWidth
								variant='gradient'
							>
								{/* {t('send-transactions:airdrop')} */}
								Airdrop
							</LinkButton>
						</Flex>
					</SendingCard>
				</Flex>
				<Flex sx={{ mt: ['32px'], flexDirection: 'column', gap: '12px' }}>
					<Title>
						{/* {t('send-transactions:previous-transactions')} */}
						Previous Transactions
					</Title>
					<SendTransactionsTable />
				</Flex>
			</LayoutContainer>
		</Page>
	)
}
