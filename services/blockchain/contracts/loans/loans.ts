import { CONTRACT_NAME } from "../../../../constants/addresses";
import { BLOCKS_PER_DAY } from "../../../../constants/core";
import { NFT } from "../../../api/walletNFTsService";
import networkUtils, {
  amountConverter,
} from "../../../../utils/blockchain/networkUtils";
import { Contract } from "../shared";
import { Token } from "@/services/api/gqlWalletSercice";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { coin } from "@/utils/blockchain/convertDenomToReadable";
import { Coin } from "@cosmjs/amino";
import { LoanTerms } from "./NFTLoans.types";

class LoansContract extends Contract {
  static async cancelLoanListing(
    loanId: string | number,
    address: string,
    client: () => Promise<SigningCosmWasmClient>
  ) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );

    return networkUtils.postTransaction(
      {
        contractAddress: loanContractAddress,
        message: {
          withdraw_collaterals: {
            loan_id: +loanId,
          } ,
        },
      },
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  static async modifyLoanListing({
    amountNative,
    durationInDays,
    interestRate,
    loanId,
    comment,
    address,
    client,
  }: {
    loanId: string | number;
    durationInDays: number | string;
    interestRate: number | string;
    amountNative: number | string;
    comment?: string;
    address: string;
    client: () => Promise<SigningCosmWasmClient>;
  }) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );

    return networkUtils.postTransaction(
      {
        contractAddress: loanContractAddress,
        message: {
          modify_collaterals: {
            loan_id: +loanId,
            terms: {
              duration_in_blocks: +durationInDays * BLOCKS_PER_DAY,
              interest: amountConverter.default.userFacingToBlockchainValue(
                (Number(amountNative ?? 0) * Number(interestRate ?? 0)) / 100
              ),
              principle: {
                amount:
                  amountConverter.default.userFacingToBlockchainValue(
                    amountNative
                  ),
                denom: networkUtils.getDefaultChainDenom() ?? "ustars",
              } as Coin,
            } as LoanTerms,
            ...(comment ? { comment } : {}),
          },
        },
      },
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  static async createLoanListing({
    amountNative,
    durationInDays,
    interestRate,
    nfts,
    previewNFT,
    comment,
    client,
    address,
  }: {
    nfts: Token[];
    durationInDays: number | string;
    interestRate: number | string;
    amountNative: number | string;
    previewNFT: Token;
    comment?: string;
    client: () => Promise<SigningCosmWasmClient>;
    address: string;
  }) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );

    return networkUtils.postManyTransactions(
      [
        ...nfts.flatMap(({ collectionAddr: collectionAddress, tokenId }) => [
          {
            contractAddress: collectionAddress,
            message: {
              approve: {
                spender: loanContractAddress,
                token_id: tokenId,
              },
            },
          },
        ]),
        {
          contractAddress: loanContractAddress,
          message: {
            deposit_collaterals: {
              tokens: nfts.map(
                ({ collectionAddr: collectionAddress, tokenId }) => ({
                  sg721_token: {
                    address: collectionAddress,
                    token_id: tokenId,
                  },
                })
              ),
              terms: {
                duration_in_blocks: +durationInDays * BLOCKS_PER_DAY,
                interest: amountConverter.default.userFacingToBlockchainValue(
                  (Number(amountNative ?? 0) * Number(interestRate ?? 0)) / 100
                ),
                principle: {
                  amount:
                    amountConverter.default.userFacingToBlockchainValue(
                      amountNative
                    ),
                  denom: networkUtils.getDefaultChainDenom(),
                },
              },
              comment,
              loan_preview: {
                sg721_token: {
                  address: previewNFT.collectionAddr,
                  token_id: previewNFT.tokenId,
                },
              },
            },
          },
        },
      ],
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  static async makeLoanOffer({
    address,
    amountNative,
    borrower,
    client,
    durationInDays,
    interestRate,
    loanId,
    comment,
  }: {
    loanId: string | number;
    borrower: string;
    durationInDays: number | string;
    interestRate: number | string;
    amountNative: number | string;
    client: () => Promise<SigningCosmWasmClient>;
    address: string;
    comment?: string;
  }) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );
    console.log({
      blockValue:
        amountConverter.default.userFacingToBlockchainValue(amountNative),
    });
    return networkUtils.postTransaction(
      {
        contractAddress: loanContractAddress,
        message: {
          make_offer: {
            borrower,
            loan_id: +loanId,
            terms: {
              duration_in_blocks: +durationInDays * BLOCKS_PER_DAY,
              interest: amountConverter.default.userFacingToBlockchainValue(
                (Number(amountNative ?? 0) * Number(interestRate ?? 0)) / 100
              ),
              principle: {
                amount:
                  amountConverter.default.userFacingToBlockchainValue(
                    amountNative
                  ),
                denom: networkUtils.getDefaultChainDenom(),
              },
            },
            comment,
          },
        },
        coins: [
          {
            amount:
              amountConverter.default.userFacingToBlockchainValue(amountNative),
            denom: "ustars",
          },
        ],
      },
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  static async cancelOffer(
    globalOfferId: string,
    address: string,
    client: () => Promise<SigningCosmWasmClient>
  ) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );

    return networkUtils.postTransaction(
      {
        contractAddress: loanContractAddress,
        message: {
          cancel_offer: {
            global_offer_id: globalOfferId,
          },
        },
      },
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  static async refuseOffer(
    globalOfferId: string,
    address: string,
    client: () => Promise<SigningCosmWasmClient>
  ) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );

    return networkUtils.postTransaction(
      {
        contractAddress: loanContractAddress,
        message: {
          refuse_offer: {
            global_offer_id: globalOfferId,
          },
        },
      },
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  static async withdrawRefusedOffer(
    globalOfferId: string,
    address: string,
    client: () => Promise<SigningCosmWasmClient>
  ) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );

    return networkUtils.postTransaction(
      {
        contractAddress: loanContractAddress,
        message: {
          withdraw_refused_offer: {
            global_offer_id: globalOfferId,
          },
        },
      },
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  static async acceptOffer(
    globalOfferId: string,
    address: string,
    client: () => Promise<SigningCosmWasmClient>
  ) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );

    return networkUtils.postTransaction(
      {
        contractAddress: loanContractAddress,
        message: {
          accept_offer: {
            global_offer_id: globalOfferId,
          },
        },
      },
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  static async fundLoan({
    address,
    amountNative,
    borrower,
    client,
    loanId,
    comment,
  }: {
    loanId: number;
    borrower: string;
    amountNative: number | string;
    comment?: string;
    address: string;
    client: () => Promise<SigningCosmWasmClient>;
  }) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );

    return networkUtils.postTransaction(
      {
        contractAddress: loanContractAddress,
        message: {
          accept_loan: {
            loan_id: loanId,
            borrower,
            ...(comment ? { comment } : {}),
          },
        },
        coins: [
          {
            amount: `${amountNative}`,
            denom: "ustars",
          },
        ],
      },
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  static async repayBorrowedFunds(
    loanId: number,
    totalAmountToRepay: string,
    address: string,
    client: () => Promise<SigningCosmWasmClient>
  ) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );

    const REPAY_TOLERANCE = 10;

    return networkUtils.postTransaction(
      {
        contractAddress: loanContractAddress,
        message: {
          repay_borrowed_funds: {
            loan_id: loanId,
          },
        },
        coins: [
          {
            amount: String(Number(totalAmountToRepay) + REPAY_TOLERANCE),
            denom: "ustars",
          },
        ],
      },
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  static async withdrawDefaultedLoan(
    loanId: number,
    borrower: string,
    address: string,
    client: () => Promise<SigningCosmWasmClient>
  ) {
    const loanContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.loan
    );

    return networkUtils.postTransaction(
      {
        contractAddress: loanContractAddress,
        message: {
          withdraw_defaulted_loan: {
            loan_id: loanId,
            borrower,
          },
        },
      },
      client,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }
}

export default LoansContract;
