/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { TBEResponse } from '@/type/response';
import { TUpgradeOverall } from '@/type/TUpgrade';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

const INVALIDATE_UPGRADES_QUERY_KEY = 'upgrades';

export const useGetUpgrades = (
  options: Omit<
    UseQueryOptions<AxiosResponse<TBEResponse<TUpgradeOverall[]>>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<TBEResponse<TUpgradeOverall[]>, any>,
    Error,
    AxiosResponse<TBEResponse<TUpgradeOverall[]>, any>
  >({
    queryKey: [INVALIDATE_UPGRADES_QUERY_KEY],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/gameplay/upgrades`, { signal });
    },
    ...options,
  });
};
