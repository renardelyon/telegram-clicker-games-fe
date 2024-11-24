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
    queryKey: ['auth', 'profile'],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/profile`, { signal });
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
      return axios.post(`${VITE_API_URL}/sign-in`);
    },
    ...mutationOptions,
  });
};
