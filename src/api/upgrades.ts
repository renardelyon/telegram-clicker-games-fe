/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { TBEResponse } from '@/type/response';
import { TUpgradeOverall } from '@/type/TUpgrade';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import {
  INVALIDATE_AUTH_QUERY_KEY,
  INVALIDATE_PROFILE_QUERY_KEY,
} from './authUser';

export const INVALIDATE_UPGRADES_QUERY_KEY = 'upgrades';

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

export const useBuyUpgrades = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, { upgrade_id: string }>,
    'onSuccess'
  > & {
    successSideEffect: (data: T) => void;
  },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, { upgrade_id: string }>({
    mutationFn: input => {
      return axios.put(`${VITE_API_URL}/gameplay/buy-upgrade`, input);
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [INVALIDATE_AUTH_QUERY_KEY, INVALIDATE_PROFILE_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [INVALIDATE_UPGRADES_QUERY_KEY],
        }),
      ]);
    },
    ...mutationOptions,
  });
};
