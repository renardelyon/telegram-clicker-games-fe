type InitData = {
  initdata: string;
};

type InitDataAction = {
  setInitData: (val: string) => void;
};

type InitDataSlice = InitData & InitDataAction;

export type { InitData, InitDataSlice, InitDataAction };
