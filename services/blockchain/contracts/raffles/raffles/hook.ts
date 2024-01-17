import { CONTRACT_NAME } from "@/constants/addresses";
import { NFT } from "@/services/api/walletNFTsService";
import { TxReceipt } from "@/services/blockchain/blockchain.interface";
// import { HumanCw20Coin } from '@/types'
import networkUtils, {
  CHAIN_NAMES,
  amountConverter as converter,
} from "@/utils/blockchain/networkUtils";
import { keysToSnake } from "@/utils/js/keysToSnake";
import { Token } from "@/services/api/gqlWalletSercice";
import { keysToCamel } from "@/utils/js/keysToCamel";
import { useChain, useWallet, walletContext } from "@cosmos-kit/react";
import { GasPrice } from "@cosmjs/stargate";
import useAddress from "@/hooks/useAddress";
import { useQuery } from "@tanstack/react-query";
import { Contract } from "../..";

const amountConverter = converter.default;
export interface ContractInfo {
  name: string;
  [key: string]: unknown;
}
export interface RaffleOptions {
  comment?: string;
  maxParticipantNumber?: number;
  maxTicketPerAddress?: number;
  raffleDuration?: number;
  rafflePreview?: number;
  raffleStartTimestamp?: number;
  raffleTimeout?: number;
}
export const useRafflesContract = () => {
  const { sign, getSigningCosmWasmClient, address } = useChain(CHAIN_NAMES[1]);
  // const addr = useWallet();

  // console.log({ addr, , walletContext });

  async function getContractInfo(
    nftContractAddress: string
  ): Promise<ContractInfo> {
    const result = await networkUtils.sendQuery(nftContractAddress, {
      contract_info: {},
    });

    return keysToCamel(result);
  }
  async function createRaffleListing(
    nfts: Token[],
    ticketPrice: string | number,
    raffleOptions: RaffleOptions
  ): Promise<TxReceipt> {
    const raffleContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.raffle
    );
    return networkUtils.postManyTransactions(
      [
        // Add cw721 tokens to raffle
        ...nfts.flatMap(({ collectionAddr: collectionAddress, tokenId }) => [
          {
            contractAddress: collectionAddress,
            message: {
              approve: {
                spender: raffleContractAddress,
                token_id: tokenId,
              },
            },
          },
        ]),
        {
          contractAddress: raffleContractAddress,
          message: {
            create_raffle: {
              assets: [
                ...nfts.flatMap(
                  ({ collectionAddr: collectionAddress, tokenId }) => [
                    {
                      cw721_coin: {
                        token_id: tokenId,
                        address: collectionAddress,
                      },
                    },
                  ]
                ),
              ],
              raffle_options: keysToSnake(raffleOptions),
              raffle_ticket_price: {
                coin: {
                  // TODO: convert to display available raffle price denoms
                  amount:
                    amountConverter.userFacingToBlockchainValue(ticketPrice),
                  // TODO: convert to display available raffle price denoms
                  denom: "ustars",
                },
              },
            },
          },
        },
      ],
      getSigningCosmWasmClient,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }
  async function modifyRaffleListing(
    raffleId: number,
    raffleOptions: RaffleOptions,
    ticketPriceAmount?: number,
    ticketPriceCurrency?: string
  ) {
    const raffleContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.raffle
    );

    return networkUtils.postTransaction(
      {
        contractAddress: raffleContractAddress,
        message: {
          modify_raffle: {
            raffle_id: raffleId,
            raffle_options: keysToSnake(raffleOptions),
            ...(ticketPriceAmount
              ? {
                  raffle_ticket_price: {
                    coin: {
                      amount: amountConverter.userFacingToBlockchainValue(
                        Number(ticketPriceAmount).toFixed(3)
                      ),
                      denom: networkUtils.getDenomForCurrency(
                        ticketPriceCurrency ?? ""
                      ),
                    },
                  },
                }
              : {}),
          },
        },
      },
      getSigningCosmWasmClient,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  async function drawRaffle(raffleId: number) {
    const raffleContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.raffle
    );

    return networkUtils.postTransaction(
      {
        contractAddress: raffleContractAddress,
        message: {
          claim_nft: {
            raffle_id: raffleId,
          },
        },
      },
      getSigningCosmWasmClient,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }

  async function purchaseRaffleTickets(
    raffleId: number,
    ticketNumber: number,
    rawAmount: string
    // cw20Coin?: HumanCw20Coin
  ): Promise<TxReceipt> {
    const raffleContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.raffle
    );

    return networkUtils.postManyTransactions(
      [
        {
          contractAddress: raffleContractAddress,
          message: {
            buy_ticket: {
              raffle_id: raffleId,
              ticket_number: ticketNumber,
              sent_assets: {
                // ...(cw20Coin
                // 	? {
                // 			cw20_coin: {
                // 				amount: amountConverter.userFacingToBlockchainValue(
                // 					(+cw20Coin.amount * ticketNumber).toFixed(6)
                // 				),
                // 				address: cw20Coin.address,
                // 			},
                // 	  }
                // 	: {}),
                ...(rawAmount
                  ? {
                      coin: {
                        amount: String(+rawAmount * ticketNumber),
                        denom: networkUtils.getDefaultChainDenom(), // TODO: update to handle all ibc denoms
                      },
                    }
                  : {}),
              },
            },
          },
          ...(rawAmount
            ? {
                coins: {
                  denom: String(+rawAmount * ticketNumber),
                },
              }
            : {}),
        },
      ],
      getSigningCosmWasmClient,
      {
        gas: 1,
      }
    );
  }
  return {
    getContractInfo,
    createRaffleListing,
    modifyRaffleListing,
    drawRaffle,
    purchaseRaffleTickets,
  };
};

export default useRafflesContract;
