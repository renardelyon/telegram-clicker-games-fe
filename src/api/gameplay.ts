/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import {
  INVALIDATE_AUTH_QUERY_KEY,
  INVALIDATE_PROFILE_QUERY_KEY,
} from './authUser';

export const useSubmitTaps = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, { taps: number; time: string }>,
    'onSuccess'
  > & {
    successSideEffect: (data: T) => void;
  },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, { taps: number; time: string }>({
    mutationFn: input => {
      return axios.put(`${VITE_API_URL}/gameplay/submit-taps`, input);
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      queryClient.invalidateQueries({
        queryKey: [INVALIDATE_AUTH_QUERY_KEY, INVALIDATE_PROFILE_QUERY_KEY],
      });
    },
    ...mutationOptions,
  });
};
