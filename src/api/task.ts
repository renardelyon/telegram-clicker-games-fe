/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { TBEResponse } from '@/type/response';
import { TTaskData } from '@/type/TTask';
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
import TaskStatusEnum from '@/enum/TaskStatusEnum';

export const INVALIDATE_TASK_QUERY_KEY = 'task';

export const useGetTasks = (
  options: Omit<
    UseQueryOptions<AxiosResponse<TBEResponse<TTaskData[]>>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<TBEResponse<TTaskData[]>, any>,
    Error,
    AxiosResponse<TBEResponse<TTaskData[]>, any>
  >({
    queryKey: [INVALIDATE_TASK_QUERY_KEY],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/tasks/list`, {
        signal,
      });
    },
    ...options,
  });
};

export const useRedeemTaskRewards = <T extends AxiosResponse<any, any>>(
  mutationOptions: Omit<
    UseMutationOptions<T, Error, { status: TaskStatusEnum; task_id: string }>,
    'onSuccess'
  > & {
    successSideEffect: (data: T) => void;
  },
) => {
  const queryClient = useQueryClient();
  return useMutation<T, Error, { status: TaskStatusEnum; task_id: string }>({
    mutationFn: input => {
      return axios.put(`${VITE_API_URL}/tasks/redeem`, input);
    },
    onSuccess: data => {
      mutationOptions.successSideEffect(data);
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [INVALIDATE_AUTH_QUERY_KEY, INVALIDATE_PROFILE_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [INVALIDATE_TASK_QUERY_KEY],
        }),
      ]);
    },
    ...mutationOptions,
  });
};
