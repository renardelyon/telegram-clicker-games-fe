import { InitData, InitDataSlice } from '@/type/TInitData';
import { StateCreator } from 'zustand';

const initialValue: InitData = {
  initdata: '',
};

const createErrorToastSlice: StateCreator<
  InitDataSlice,
  [],
  [],
  InitDataSlice
> = set => {
  return {
    ...initialValue,
    setInitData: (val: string) => set({ initdata: val }),
  };
};

export default createErrorToastSlice;
