export function formaCurrency(amt: number, decimals = 6) {
  return amt / Math.pow(10, decimals);
}
