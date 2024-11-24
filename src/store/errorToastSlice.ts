import { ErrorToast, ErrorToastSlice } from '@/type/TErrorToastSlice';
import { StateCreator } from 'zustand';

const initialValue: ErrorToast = {
  isOpen: false,
  message: '',
};

const createErrorToastSlice: StateCreator<
  ErrorToastSlice,
  [],
  [],
  ErrorToastSlice
> = set => {
  return {
    ...initialValue,
    setErrorToast: val => set(state => ({ ...state, ...val })),
    resetErrorToast: () => set({ ...initialValue }),
  };
};

export default createErrorToastSlice;
