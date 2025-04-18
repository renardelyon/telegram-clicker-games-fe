/* eslint-disable @typescript-eslint/no-explicit-any */
import { PumpFunCaller } from '@/utils/pumpfun';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';

export const PUMPFUN_QUERY_KEY = 'pumpfun';

export const useGetTokenName = (
  targetMintAddr: string,
  pumpfunCaller?: PumpFunCaller,
  options: Omit<UseQueryOptions<string>, 'queryKey' | 'queryFn'> = {},
) => {
  return useQuery<string, Error, string>({
    queryKey: [PUMPFUN_QUERY_KEY, 'token_name'],
    queryFn: () => {
      if (!pumpfunCaller)
        return Promise.reject('Pumpfun instance has not been instantiated');
      return pumpfunCaller?.getTokenNameFromMint(targetMintAddr);
    },
    ...options,
  });
};

export const useGetBuyAmount = (
  targetMint: PublicKey,
  value: number,
  pumpfunCaller?: PumpFunCaller,
  options: Omit<UseQueryOptions<bigint>, 'queryKey' | 'queryFn'> = {},
) => {
  return useQuery<bigint, Error, bigint>({
    queryKey: [PUMPFUN_QUERY_KEY, 'buy_amount', value],
    queryFn: () => {
      if (!pumpfunCaller)
        return Promise.reject('Pumpfun instance has not been instantiated');
      return pumpfunCaller?.getBuyAmount(targetMint, BigInt(value));
    },
    ...options,
  });
};
