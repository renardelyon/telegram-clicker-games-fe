import { VITE_API_URL } from '@/env/env';
import { TBEResponse } from '@/type/response';
import { TUserProfile } from '@/type/TUserProfile';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const INVALIDATE_REFERRAL_QUERY_KEY = 'REFERRAL';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useAddReferral = <T extends AxiosResponse<any, any>>(
  mutationOptions: UseMutationOptions<T, Error, { referred_by: number }>,
) => {
  return useMutation<T, Error, { referred_by: number }>({
    mutationFn: input => {
      return axios.post(`${VITE_API_URL}/referral/add`, input);
    },
    ...mutationOptions,
  });
};

export const useGetReferrals = (
  options: Omit<
    UseQueryOptions<AxiosResponse<TBEResponse<TUserProfile[]>>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<TBEResponse<TUserProfile[]>, any>,
    Error,
    AxiosResponse<TBEResponse<TUserProfile[]>, any>
  >({
    queryKey: [INVALIDATE_REFERRAL_QUERY_KEY],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/referral/list`, {
        signal,
      });
    },
    ...options,
  });
};
