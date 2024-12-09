/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { TBEResponse } from '@/type/response';
import { TTaskData } from '@/type/TTask';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

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
