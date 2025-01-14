import React from 'react'
// // import { useTranslation } from 'next-i18next'
import { Flex } from 'theme-ui'
import { queryTypes, useQueryState } from 'next-usequerystate'
import { 
	makeStaticPaths,
	 makeStaticProps } from '../lib/getStatic'
import {
	Title,
	SectionTitle,
	// WatchListTrade,
	WatchListRaffles,
	OutgoingRaffleOffers,
	IncomingRaffleOffers,
	WatchListLoans,
	IncomingLoanOffers,
	OutgoingLoanOffers,
} from '../components/dashboard'
// import IncomingTradeOffers from '../components/dashboard/IncomingTradeOffers'
// import OutgoingTradeOffers from '../components/dashboard/OutgoingTradeOffers'
import If from '../components/core/if-statement'
import { LayoutContainer, Page } from '../components/layout'
import { Tab, Tabs } from '../components/ui'

// const getStaticProps = makeStaticProps([
// 	'common',
// 	'dashboard',
// 	'trade-listings',
// 	'trade',
// 	'raffle',
// 	'raffle-listings',
// 	'loan',
// 	'loan-listings',
// ])
const getStaticPaths = makeStaticPaths()
// export { getStaticPaths, getStaticProps }

export enum ACTIVITY_TYPE {
	outgoingActivity = 'outgoing',
	incomingActivity = 'incoming',
}

export enum FEATURE_TYPE {
	// trade = 'Trade',
	raffle = 'Raffle',
	loan = 'Loan',
}

export default function Dashboard() {
	// const { t } = useTranslation(['common', 'dashboard'])
	const [activityType, setActivityType] = useQueryState(
		'activityType',
		queryTypes
			.stringEnum<ACTIVITY_TYPE>(Object.values(ACTIVITY_TYPE))
			.withDefault(ACTIVITY_TYPE.incomingActivity)
	)

	const [feature, setFeature] = useQueryState(
		'featureType',
		queryTypes
			.stringEnum<FEATURE_TYPE>(Object.values(FEATURE_TYPE))
			.withDefault(FEATURE_TYPE.raffle)
	)

	return (
		<Page title="AtlasDAO WebApp" //{'common:title'}
		>
			<LayoutContainer>
				<Flex sx={{ flexDirection: 'column', pt: ['12px', '32px'] }}>
					<Title>
					{/* {'dashboard:watch-list.title'} */}
					Your Watch List
					</Title>
					<Flex
						sx={{
							justifyContent: 'space-between',
							maxWidth: [null, null, '410px'],
							my: '12px',
							mb: '24px',
						}}
					>
						<Tabs
							onChange={e => setFeature(e.target.value as FEATURE_TYPE)}
							value={feature}
							name='feature'
						>
							{Object.values(FEATURE_TYPE).map(feat => (
								<Tab key={feat} value={feat}>
									{`${feat}`}
								</Tab>
							))}
						</Tabs>
					</Flex>
					<Flex sx={{ mb: ['24px', '24px'] }}>
						{/* <If condition={feature === FEATURE_TYPE.trade}>
							<WatchListTrade />
						</If> */}
						<If condition={feature === FEATURE_TYPE.raffle}>
							<WatchListRaffles />
						</If>
						<If condition={feature === FEATURE_TYPE.loan}>
							<WatchListLoans />
						</If>
					</Flex>

					{/* <Title>
					Activity
					</Title> */}
					{/* <Flex
						sx={{
							justifyContent: 'space-between',
							maxWidth: [null, null, '410px'],
							my: '24px',
						}}
					>
						<Tabs
							onChange={e => setActivityType(e.target.value as ACTIVITY_TYPE)}
							value={activityType}
							name='activityType'
						>
							<Tab value={ACTIVITY_TYPE.incomingActivity}>
								{`${feature}s Incoming`}
						
							</Tab>
							<Tab value={ACTIVITY_TYPE.outgoingActivity}>
								{`${feature}s Outgoing`}
							</Tab>
						</Tabs>
					</Flex> */}
					<SectionTitle />
{/* 				
					<If condition={feature === FEATURE_TYPE.raffle}>
						<>
							{activityType === ACTIVITY_TYPE.incomingActivity && (
								<IncomingRaffleOffers />
							)}
							{activityType === ACTIVITY_TYPE.outgoingActivity && (
								<OutgoingRaffleOffers />
							)}
						</>
					</If>
					<If condition={feature === FEATURE_TYPE.loan}>
						<>
							{activityType === ACTIVITY_TYPE.incomingActivity && (
								<IncomingLoanOffers />
							)}
							{activityType === ACTIVITY_TYPE.outgoingActivity && (
								<OutgoingLoanOffers />
							)}
						</>
					</If> */}
				</Flex>
			</LayoutContainer>
		</Page>
	)
}
