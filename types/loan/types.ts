import { Token } from '@/services/api/gqlWalletSercice'

export interface LoanFormStepsProps {
	// SHARED
	loanDetailsUrl: string
	explorerUrl: string

	// SELECT_NFTS STEP
	coverNFT: Token
	selectedNFTs: Token[]
	isSuccessScreen: boolean

	// LOAN_DETAILS STEP
	tokenAmount: string
	tokenName: string
	interestRate: string
	loanPeriod: string
	comment: string
}

export type LoanOfferForm = {
	tokenAmount: string
	tokenName: string
	interestRate: string
	loanPeriod: string
	comment: string
}
