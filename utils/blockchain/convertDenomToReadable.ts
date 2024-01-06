export const convertDenomToReadable = (amount: string | number | null) => {
  return Number(amount) / 1000000
}


export function coin(amount: number | string = 0, exponent = STARGAZE_TOKEN_EXPONENT) {
  if (!amount) return { amount: '0', denom: STARGAZE_TOKEN_DENOM };
  return {
    denom: STARGAZE_TOKEN_DENOM,
    amount: new BigNumber(amount).shiftedBy(exponent).toString()
  };
};