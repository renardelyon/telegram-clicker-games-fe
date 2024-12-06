/* eslint-disable @typescript-eslint/no-explicit-any */
import { VITE_API_URL } from '@/env/env';
import { TBEResponse } from '@/type/response';
import { TLeaderboardData } from '@/type/TLeaderboardData';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const INVALIDATE_LEADERBOARD_QUERY_KEY = 'leaderboard';

export const useGetLeaderboard = (
  limit: number,
  options: Omit<
    UseQueryOptions<AxiosResponse<TBEResponse<TLeaderboardData>>>,
    'queryKey' | 'queryFn'
  > = {},
) => {
  return useQuery<
    AxiosResponse<TBEResponse<TLeaderboardData>, any>,
    Error,
    AxiosResponse<TBEResponse<TLeaderboardData>, any>
  >({
    queryKey: [INVALIDATE_LEADERBOARD_QUERY_KEY],
    queryFn: ({ signal }) => {
      return axios.get(`${VITE_API_URL}/leaderboard/list?limit=${limit}`, {
        signal,
      });
    },
    ...options,
  });
};
