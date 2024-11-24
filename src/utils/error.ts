import { TBEResponse } from '@/type/response';
import axios from 'axios';

type errorHandlerArgsType = {
  axiosErrorHandlerFn?: (errMsg?: string) => void;
  generalErrorHandlerFn?: (err: Error) => void;
  error: Error;
};

const errorHandler = ({
  axiosErrorHandlerFn,
  generalErrorHandlerFn,
  error,
}: errorHandlerArgsType) => {
  if (axios.isAxiosError<TBEResponse, unknown>(error)) {
    axiosErrorHandlerFn?.(error.response?.data.message);
    return;
  }

  generalErrorHandlerFn?.(error);
  return;
};

export default errorHandler;
