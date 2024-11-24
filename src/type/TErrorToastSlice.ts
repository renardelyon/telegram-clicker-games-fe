type ErrorToast = {
  isOpen: boolean;
  message: string;
};

type ErrorToastAction = {
  setErrorToast: (val?: ErrorToast) => void;
  resetErrorToast: () => void;
};

type ErrorToastSlice = ErrorToast & ErrorToastAction;

export type { ErrorToast, ErrorToastSlice, ErrorToastAction };
