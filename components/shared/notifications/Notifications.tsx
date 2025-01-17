import { useQuery } from '@tanstack/react-query'
import TradeIcon from '@/assets/icons/mixed/components/TradeIcon'
import useAddress from '@/hooks/useAddress'
import moment from 'moment'
// import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React from 'react'
import {
	READ_STATUS,
	TradeNotificationsService,
	TRADE_NOTIFICATION_TYPE,
} from '@/services/api/tradeNotificationsService'
import * as ROUTES from '@/constants/routes'
import {
	LoanNotificationsService,
	LOAN_NOTIFICATION_TYPE,
} from '@/services/api/loanNotificationsService'
import { WalletIcon } from '@/assets/icons/mixed'
import { getNetworkName } from '@/utils/blockchain/networkUtils'
import NotificationCard from '../notifications-card/NotificationCard'

interface NotificationsProps {
	fullWidth?: boolean
}
function Notifications({ fullWidth }: NotificationsProps) {
// 	const { t } = useTranslation()
	const networkName = getNetworkName()
	const myAddress = useAddress()
	const router = useRouter()

	// const { data: tradeNotifications } = useQuery(
	// 	[TRADE_NOTIFICATION_TYPE, myAddress],
	// 	async () =>
	// 		TradeNotificationsService.getTradeNotifications(
	// 			networkName,
	// 			{
	// 				user: myAddress,
	// 			},
	// 			{
	// 				page: 1,
	// 				limit: 30,
	// 			}
	// 		),
	// 	{
	// 		enabled: !!myAddress,
	// 		retry: true,
	// 	}
	// )

	const { data: loanNotifications } = useQuery(
		[LOAN_NOTIFICATION_TYPE, myAddress],
		async () =>
			LoanNotificationsService.getLoanNotifications(
				networkName,
				{
					user: myAddress,
				},
				{
					page: 1,
					limit: 30,
				}
			),
		{
			enabled: !!myAddress,
			retry: true,
		}
	)

	const getNotificationMessageFromType = (
		type: TRADE_NOTIFICATION_TYPE | LOAN_NOTIFICATION_TYPE
	) => {
		const messages = {
			[TRADE_NOTIFICATION_TYPE.NewCounterTrade]:
			//  t('common:new-counter-trade-message'),
			'You received an offer on your trade',
			[TRADE_NOTIFICATION_TYPE.CounterTradeReview]: 
			// t('common:counter-trade-review-message'),
			'Your offer is in review',
			[TRADE_NOTIFICATION_TYPE.CounterTradeAccepted]:
			//  t('common:counter-trade-accepted-message'),
			'Your offer has been accepted',
			[TRADE_NOTIFICATION_TYPE.OtherCounterTradeAccepted]:
//  t('common:other-counter-trade-accepted'),
			'A different offer was accepted',
			[TRADE_NOTIFICATION_TYPE.TradeCancelled]:
//  t('common:trade-cancelled-message'),
			'This trade has been cancelled',
			[TRADE_NOTIFICATION_TYPE.RefuseCounterTrade]:
//  t('common:refuse-counter-trade-message'),
			'Your counter has been refused',
			[LOAN_NOTIFICATION_TYPE.LoanAccepted]:
//  t('common:loan-accepted-message'),
'Your loan has been accepted!',
			[LOAN_NOTIFICATION_TYPE.LoanCancelled]:
//  t('common:loan-cancelled-message'),
'Loan offer has been cancelled',
			[LOAN_NOTIFICATION_TYPE.NewOffer]:
//  t('common:loan-new-offer-message'),
'You recieviced an offer on your loan',
			[LOAN_NOTIFICATION_TYPE.OfferAccepted]:
//  t('common:offer-accepted-message'),
'Your offer has been accepted',
			[LOAN_NOTIFICATION_TYPE.OtherOfferAccepted]:
//  t('common:other-offer-accepted-message'),
'A different offer was accepted',
			[LOAN_NOTIFICATION_TYPE.RefuseOffer]:
//  t('common:refuse-offer-message'),
'Your offer has been refused',
		}

		const actionMessages = {
			[TRADE_NOTIFICATION_TYPE.NewCounterTrade]:
//  t('common:new-counter-trade-action-message'),
'Reply to offer to make the deal',
			[TRADE_NOTIFICATION_TYPE.CounterTradeReview]:
//  t('common:counter-trade-review-action-message'),
'Check your offer',
			[TRADE_NOTIFICATION_TYPE.CounterTradeAccepted]:
//  t('common:counter-trade-accepted-action-message'),
'Withdraw your trade',
			[TRADE_NOTIFICATION_TYPE.OtherCounterTradeAccepted]:
//  t('common:other-counter-trade-action-accepted'),
'Check your offer',
			[TRADE_NOTIFICATION_TYPE.TradeCancelled]:
//  t('common:trade-cancelled-action-message'),
'Withdraw your offers',
			[TRADE_NOTIFICATION_TYPE.RefuseCounterTrade]:
//  t('common:refuse-counter-trade-action-message'),
'Check your offer',
			[LOAN_NOTIFICATION_TYPE.LoanAccepted]:
//  t('common:loan-accepted-action-message'),
'Check your loan offer',
			[LOAN_NOTIFICATION_TYPE.LoanCancelled]:
//  t('common:loan-cancelled-action-message'),
'Check your offer!',
			[LOAN_NOTIFICATION_TYPE.NewOffer]:
//  t('common:loan-new-offer-action-message'),
'You received an offer on your loan',
			[LOAN_NOTIFICATION_TYPE.OfferAccepted]:
//  t('common:offer-accepted-action-message'),
'Check offer',
			[LOAN_NOTIFICATION_TYPE.OtherOfferAccepted]:
//  t('common:other-offer-accepted-action-message'),
'Check your offer',
			[LOAN_NOTIFICATION_TYPE.RefuseOffer]:
//  t('common:refuse-offer-action-message'),
'Withdraw your offer'
		}

		return {
			message: messages[type] ?? '',
			actionMessage: actionMessages[type] ?? '',
		}
	}

	const unreadNotifications = [
		// ...(tradeNotifications?.data ?? [])
		// 	.filter(x => x.status === READ_STATUS.UNREAD)
		// 	.map(
		// 		({ id, tradeId, notificationPreview, notificationType, time, status }) => {
		// 			const { message, actionMessage } =
		// 				getNotificationMessageFromType(notificationType)
		// 			return {
		// 				id,
		// 				data: { tradeId: String(tradeId), time, loanId: '', borrower: '' },
		// 				timeDescription: moment(time).fromNow(),
		// 				status,
		// 				message,
		// 				actionMessage,
		// 				imageUrl: notificationPreview?.cw721Coin?.imageUrl ?? [],
		// 				typeBadge: {
		// 					icon: <TradeIcon width='15px' height='17px' color='#fff' />,
		// 					background: 'linear-gradient(135deg, #61EA77 0%, #22BB28 100%)',
		// 				},
		// 			}
		// 		}
		// 	),
		...(loanNotifications?.data ?? [])
			.filter(x => x.status === READ_STATUS.UNREAD)
			.map(
				({
					id,
					loanId,
					borrower,
					notificationPreview,
					notificationType,
					time,
					status,
				}) => {
					const { message, actionMessage } =
						getNotificationMessageFromType(notificationType)
					return {
						id,
						data: { tradeId: '', loanId: String(loanId), borrower, time },
						timeDescription: moment(time).fromNow(),
						status,
						message,
						actionMessage,
						imageUrl: notificationPreview?.cw721Coin?.id ?? [],
						typeBadge: {
							icon: <WalletIcon width='15px' height='17px' color='#fff' />,
							background: 'linear-gradient(135deg, #61EA77 0%, #22BB28 100%)',
						},
					}
				}
			),
	].sort((a, b) => moment(b.data?.time).diff(moment(a?.data?.time)))

	const readNotifications = [
		// ...(tradeNotifications?.data ?? [])
		// 	.filter(x => x.status === READ_STATUS.READ)
		// 	.map(
		// 		({ id, tradeId, notificationPreview, notificationType, time, status }) => {
		// 			const { message, actionMessage } =
		// 				getNotificationMessageFromType(notificationType)
		// 			return {
		// 				id,
		// 				data: { tradeId: String(tradeId), time, loanId: '', borrower: '' },
		// 				timeDescription: moment(time).fromNow(),
		// 				status,
		// 				message,
		// 				actionMessage,
		// 				imageUrl: notificationPreview?.cw721Coin?.imageUrl ?? [],
		// 				typeBadge: {
		// 					icon: <TradeIcon width='15px' height='17px' color='#fff' />,
		// 					background: 'linear-gradient(135deg, #61EA77 0%, #22BB28 100%)',
		// 				},
		// 			}
		// 		}
		// 	),
		...(loanNotifications?.data ?? [])
			.filter(x => x.status === READ_STATUS.READ)
			.map(
				({
					id,
					loanId,
					borrower,
					notificationPreview,
					notificationType,
					time,
					status,
				}) => {
					const { message, actionMessage } =
						getNotificationMessageFromType(notificationType)
					return {
						id,
						data: { tradeId: '', loanId: String(loanId), borrower, time },
						timeDescription: moment(time).fromNow(),
						status,
						message,
						actionMessage,
						imageUrl: notificationPreview?.cw721Coin?.id ?? [],
						typeBadge: {
							icon: <WalletIcon width='15px' height='17px' color='#fff' />,
							background: 'linear-gradient(135deg, #61EA77 0%, #22BB28 100%)',
						},
					}
				}
			),
	].sort((a, b) => moment(b.data?.time).diff(moment(a?.data?.time)))

	return (
		<NotificationCard
			fullWidth={fullWidth}
			onNotificationClick={({ tradeId, loanId, borrower }) => {
				if (borrower && loanId) {
					return router.push(
						`${ROUTES.LOAN_LISTING_DETAILS}?loanId=${loanId}&borrower=${borrower}`
					)
				}
				if (tradeId) {
					return router.push(`${ROUTES.RAFFLE_LISTING_DETAILS}?tradeId=${tradeId}`)
				}

				return null
			}}
			title='Notifications' // {t('common:notifications')}
			newNotificationsTitle='New'// {t('common:new'}
			oldNotificationsTitle='Older' // {t('common:older')}
			oldNotifications={readNotifications}
			newNotifications={unreadNotifications}
		/>
	)
}

Notifications.defaultProps = {
	fullWidth: false,
}
export default Notifications
