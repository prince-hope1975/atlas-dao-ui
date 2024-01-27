import { CONTRACT_NAME } from "@/constants/addresses";
import { DrandResponse } from "@/services/api/drandService";
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
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { ExecuteMsg } from "../Raffle.types";
import { coin, coins } from "@cosmjs/amino";

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
  const { sign, getSigningCosmWasmClient, address, getCosmWasmClient } =
    useChain(CHAIN_NAMES[1]);

  // const addr = useWallet();

  // console.log({ addr, , walletContext });

  async function getContractInfo(
    nftContractAddress: string
  ): Promise<ContractInfo> {
    const client = await getCosmWasmClient();
    console.log({ nftContractAddress });
    const result = client.getContracts(2595);
    return keysToCamel(result);
  }
  async function provideRandomness(
    raffleId: number,
  ) {
    const raffleContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.raffle
    );

    return networkUtils.postTransaction(
      {
        contractAddress: raffleContractAddress,
        message: {
          update_randomness: keysToSnake({
            raffleId,
          }),
        },
      },
      getSigningCosmWasmClient,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }
  async function createRaffleListing(
    nfts: Token[],
    ticketPrice: string | number,
    raffleOptions: RaffleOptions
  ): Promise<TxReceipt> {
    const raffleContractAddress = networkUtils.getContractAddress(
      CONTRACT_NAME.raffle
    );
    const createRaffle: Extract<
      ExecuteMsg,
      { create_raffle: any }
    >["create_raffle"] = {
      owner: address,
      assets: [
        ...nfts.flatMap(({ collectionAddr: collectionAddress, tokenId }) => [
          {
            sg721_token: {
              token_id: tokenId,
              address: collectionAddress,
            },
            // cw721_coin: {
            //   token_id: tokenId,
            //   address: collectionAddress,
            // },
          },
        ]),
      ],
      raffle_options: keysToSnake(raffleOptions),
      raffle_ticket_price: {
        coin: {
          // TODO: convert to display available raffle price denoms
          amount: amountConverter.userFacingToBlockchainValue(ticketPrice),
          //! convert to display available raffle price denoms
          denom: "ustars",
        },
      },
    };

    // const client =new SigningCosmWasmClient()
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
          // TODO make this dynamic

          coins: coins(69, "ustars"),
          message: {
            create_raffle: createRaffle,
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
    console.log({
      coin: {
        amount: String(+rawAmount * ticketNumber),
        denom: networkUtils.getDefaultChainDenom(), // TODO: update to handle all ibc denoms
      },
    });
    return networkUtils.postManyTransactions(
      [
        {
          contractAddress: raffleContractAddress,
          message: {
            buy_ticket: {
              raffle_id: raffleId,
              ticket_count: ticketNumber,
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
                coins: coins(
                  String(+rawAmount * ticketNumber),
                  networkUtils.getDefaultChainDenom()
                ),
              }
            : {}),
        },
      ],
      getSigningCosmWasmClient,
      {
        gas: 1_000_000,
        address: address!,
      }
    );
  }
  return {
    provideRandomness,
    getContractInfo,
    createRaffleListing,
    modifyRaffleListing,
    drawRaffle,
    purchaseRaffleTickets,
  };
};

export default useRafflesContract;
