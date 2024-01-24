import { Token } from '@/services/api/gqlWalletSercice'
import { LOAN_STATE } from '@/services/api/loansService'

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
interface CollateralTerms {
  principle: {
    denom: string;
    amount: string; 
  };
  interest: string;
  duration_in_blocks: number;
}

interface AssociatedAsset {
  sg721_token: {
    address: string;
    token_id: string;
  }
}

export interface Collateral {
  borrower: string;
  loan_id: number;
  collateral: {
    terms: CollateralTerms;
    associated_assets: AssociatedAsset[];
    list_date: string;
    state: LOAN_STATE;
    offer_amount: number;
    active_offer: `${number}`;
    start_block: null;
    comment: string;
    loan_preview: {
      sg721_token: {
        address: string;
        token_id: string;
      };
    };
  };
}

export interface CollateralsResponse {
  collaterals: Collateral[];
  next_collateral: [string, number];
}

type OfferTerms = {
  principle: {
    denom: string;
    amount: string;
  };
  interest: string;
  duration_in_blocks: number;
};


export type Offer = {
  global_offer_id: string;
  offer_info: OfferInfo;
};

export type OffersResponse = {
  offers: Offer[];
  next_offer: string;
};




type OfferInfo = {
  lender: string;
  borrower: string;
  loan_id: number;
  offer_id: number;
  terms: OfferTerms;
  state: string;
  list_date: string;
  deposited_funds: {
    denom: string;
    amount: string;
  };
  comment: string;
};

export type OfferResponse = {
  global_offer_id: string;
  offer_info: OfferInfo;
};
