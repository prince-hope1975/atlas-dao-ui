import { useQuery } from '@tanstack/react-query'

// // import { useTranslation } from 'next-i18next'
import React from 'react'
import useAddress from '@/hooks/useAddress'
import { LoansService } from '@/services/api'
import { ALL_LOANS, LOANS } from '@/constants/useQueryKeys'
import { MultiSelectAccordionInputOption } from '../ui/multi-select-accordion-input/MultiSelectAccordionInput'
import { LOAN_STATE } from '@/services/api/loansService'
import { getNetworkName } from '@/utils/blockchain/networkUtils'
import LoanOffers from './LoanOffers'

function IncomingLoanOffers() {
	const [page, setPage] = React.useState(1)
	const myAddress = useAddress()
	const networkName = getNetworkName()
	// const { t } = useTranslation(['common', 'dashboard'])

	// const [
	// 	activeStatusLabel,
	// 	inactiveStatusLabel,
	// 	publishedStatusLabel,
	// 	startedStatusLabel,
	// 	defaultedStatusLabel,
	// 	endedStatusLabel,
	// 	withdrawnLabel,
	// ]: Array<string> = t('dashboard:loans.statuses', {
	// 	returnObjects: true,
	// })

	const statusOptions = [
		{
			label: "Active", // activeStatusLabel,
			value: JSON.stringify([
				LOAN_STATE.Published,
				LOAN_STATE.Started,
				LOAN_STATE.PendingDefault,
			]),
		},
		{
			label: "Inactive",// inactiveStatusLabel,
			value: JSON.stringify([LOAN_STATE.Ended, LOAN_STATE.Inactive]),
		},
		{
			label: "Published", // publishedStatusLabel,
			value: JSON.stringify([LOAN_STATE.Published]),
		},
		{
			label:  "Started" , // startedStatusLabel,
			value: JSON.stringify([LOAN_STATE.Started]),
		},
		{
			label: "Defaulted", // defaultedStatusLabel,
			value: JSON.stringify([LOAN_STATE.PendingDefault]),
		},
		{
			label: "Ended", // endedStatusLabel,
			value: JSON.stringify([LOAN_STATE.Ended]),
		},
		{
			label: "Withdrawn", //withdrawnLabel,
			value: JSON.stringify([LOAN_STATE.Inactive, LOAN_STATE.Defaulted]),
		},
	]

	const [statuses, setStatuses] = React.useState<
		MultiSelectAccordionInputOption[]
	>([])

	const [collections, setCollections] = React.useState<
		MultiSelectAccordionInputOption[]
	>([])

	const { data: allLoans, isFetched: allFetched } = useQuery(
		[ALL_LOANS, networkName, myAddress],
		async () =>
			LoansService.getAllLoans(
				networkName,
				{
					myAddress,
					borrowers: [myAddress],
					hasOffers: true,
				},
				{
					page,
					limit: 1,
				}
			),
		{
			retry: true,
		}
	)

	const {
		data: loans,
		isLoading,
		refetch,
		isFetched: loansFetched,
	} = useQuery(
		[LOANS, networkName, myAddress, page, statuses, collections, allFetched],
		async () =>
			LoansService.getAllLoans(
				networkName,
				{
					myAddress,
					borrowers: [myAddress],
					states: statuses.flatMap(({ value }) => JSON.parse(value)),
					collections: collections.map(({ value }) => value),
					hasOffers: true,
				},
				{
					page,
					limit: 3,
				}
			),
		{
			enabled: allFetched,
			retry: true,
		}
	)

	return (
		<LoanOffers
			loans={loans}
			allLoans={allLoans}
			setPage={setPage}
			page={page}
			isLoading={isLoading}
			refetch={refetch}
			setStatuses={setStatuses}
			statuses={statuses}
			collections={collections}
			setCollections={setCollections}
			statusOptions={statusOptions}
			loansFetched={loansFetched}
		/>
	)
}

export default IncomingLoanOffers
