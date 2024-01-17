import { Token } from "@/services/api/gqlWalletSercice";

export interface RaffleFormStepsProps {
  raffleDetailsUrl: string;
  explorerUrl: string;
  // SELECT_NFTS STEP
  coverNFT: Token;
  selectedNFTs: Token[];

  // RAFFLE DETAILS STEP
  endDate: Date;
  endTime: Date;
  ticketSupply: number;
  ticketPrice: number;
  ticketPriceCurrency: string;
  comment: string;

  // CONFIRM
  isSuccessScreen: boolean;
}
