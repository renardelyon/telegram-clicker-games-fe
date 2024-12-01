/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { TBEResponse } from '@/type/response';
import { TUserProfile } from '@/type/TUserProfile';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const INVALIDATE_AUTH_QUERY_KEY = 'auth';
export const INVALIDATE_PROFILE_QUERY_KEY = 'profile';

export const useGetProfile = (
  options: Omit<
    UseQueryOptions<AxiosResponse<TBEResponse<TUserProfile>>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<TBEResponse<TUserProfile>, any>,
    Error,
    AxiosResponse<TBEResponse<TUserProfile>, any>
  >({
    queryKey: [INVALIDATE_AUTH_QUERY_KEY, INVALIDATE_PROFILE_QUERY_KEY],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/auth/profile`, { signal });
    },
    ...options,
  });
};

export const useUserSignIn = (
  mutationOptions: UseMutationOptions<
    AxiosResponse<any, any>,
    Error,
    void,
    unknown
  >,
) => {
  return useMutation<AxiosResponse<any, any>, Error, void>({
    mutationFn: () => {
      return axios.post(`${VITE_API_URL}/auth/sign-in`);
    },
    ...mutationOptions,
  });
};
