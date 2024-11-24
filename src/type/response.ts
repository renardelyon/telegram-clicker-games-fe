type TBEResponse<T = unknown> = {
  status: number;
  message: string;
  data?: T;
  timestamp: string;
};

export type { TBEResponse };
