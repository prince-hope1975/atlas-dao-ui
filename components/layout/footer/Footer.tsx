// import { useTranslation } from 'next-i18next'
// import moment from 'moment'
// import IlliquidlyFooterLogo from '@/assets/images/IlliquidLabsLogo'
import * as ROUTES from '@/constants/routes'
import { Box, Flex, IconButton } from 'theme-ui'
import { DiscordIcon, TwitterIcon } from '@/assets/icons/mixed'
import { Link } from '../../link'
import { Button } from '../../ui/button'
import { LayoutContainer } from '../layout'
import atlasDAO from '@/public/atlas-dao.png' 
import Image from 'next/image'
import {
	Content,
	FooterWrapper,
	LeftFooterSection,
	LightText,
	LinksContainer,
	LinkText,
	LitepaperText,
	RightFooterSection,
	SocialActionContainer,
	TradeMarkContainer,
} from './Footer.styled'

function Footer() {
	// const { t } = useTranslation('common')

	return (
		<FooterWrapper>
			<LayoutContainer>
				<Content>
					<LeftFooterSection>
						<Box
							sx={{
								cursor: 'pointer',
								maxWidth: ['127px', '161px'],
								maxHeight: ['38.63px', '42px'],
							}}
						>
							<Link passHref href={ROUTES.DASHBOARD}>
								{/* <a> */}
								<Image src={atlasDAO} alt="AtlasDAO" width={50} height={50}/>
								{/* </a> */}
							</Link>
						</Box>
						<LightText sx={{ margin: '16px 0 40px' }}>
							{/* {t('description')} */}
							Description
							</LightText>

						<SocialActionContainer>
							<Button
								onClick={() => window.open(ROUTES.GITBOOK, '_blank')}
								variant='primary'
								size='small'
							>
								<LitepaperText>
									{/* {t('litepaper')} */}
									Litepaper
									</LitepaperText>
							</Button>
							<IconButton
								onClick={() => window.open(ROUTES.TWITTER, '_blank')}
								size='24px'
								p={0}
							>
								<TwitterIcon />
							</IconButton>
							<IconButton
								onClick={() => window.open(ROUTES.DISCORD, '_blank')}
								size='28px'
								p={0}
							>
								<DiscordIcon />
							</IconButton>
						</SocialActionContainer>
					</LeftFooterSection>

					<RightFooterSection>
						<LinksContainer>
							<Link href={ROUTES.DASHBOARD}>
								<LinkText>
								{/* {t('links.dashboard')} */}
								Dashboard
								</LinkText>
							</Link>
							{/* <Link href={ROUTES.TRADE_LISTINGS}>
								<LinkText>
								{t('links.trade')}
								Trades
								</LinkText>
							</Link>
							<Link href={ROUTES.SEND_TRANSACTIONS}>
								<LinkText>
								{t('links.send')}
								</LinkText>
							</Link> */}
							<Link href={ROUTES.LOAN_LISTINGS}>
								<LinkText>
								{/* {t('links.loans')} */}\
								Loans
								</LinkText>
							</Link>
							<Link href={ROUTES.RAFFLE_LISTINGS}>
								<LinkText>
								{/* {t('links.raffles')} */}
								Raffles
								</LinkText>
							</Link>
							{/* <Link href={ROUTES.MIGRATION}>
								<LinkText>
								{t('links.migrate')}
								Migrate
								</LinkText>
							</Link> */}
						</LinksContainer>

						<Flex
							sx={{
								flexDirection: 'column',
								textAlign: 'end',
								justifyContent: 'flex-end',
							}}
						>
							<LightText>
								{/* {t('audit')} */}
								Audit 
								</LightText>
							<LightText>
								{/* {`${t('click')} `} */}
								Click
								<Box
									onClick={() => window.open(ROUTES.AUDIT, '_blank')}
									as='span'
									sx={{ color: 'primary200', cursor: 'pointer' }}
								>
									{/* {t('here')} */}
									here
								</Box>
								{/* {` ${t('to-see-reports')}`} */}
						to see reports
							</LightText>
						</Flex>

						<TradeMarkContainer>
							<LightText>
								{/* {t('trademark', { year: moment().year().toString() })} */}
							</LightText>
						</TradeMarkContainer>
					</RightFooterSection>
				</Content>
			</LayoutContainer>
		</FooterWrapper>
	)
}

export default Footer
