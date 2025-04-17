export const calculateWithSlippageBuy = (amount: bigint, basisPoints: bigint) =>
  amount + (amount * basisPoints) / 10000n;
