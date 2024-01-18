import { ChainId } from '../types'

export const txExplorerFactory: {
  [k in ChainId]: (txId) => string;
} = {
  "stargaze-1": (txId: string) => `https://ping.pub/stargaze/tx/${txId}`,
  "elgafar-1": (txId: string) =>
    `https://testnet-explorer.publicawesome.dev/stargaze/tx/${txId}`,
};
