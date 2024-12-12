import { TUserProfile } from '@/type/TUserProfile';

type UserData = {
  user: TUserProfile;
};

type UserDataAction = {
  setUserData: (val?: TUserProfile) => void;
  addBalance: (val: number) => void;
  decrementEnergy: (val: number) => void;
  incrementEnergy: (val: number) => void;
  incrementEnergyWithCallback: (callback: (energy: number) => number) => void;
  setEnergy: (val: number) => void;
};

type UserDataSlice = UserData & UserDataAction;

export type { UserData, UserDataSlice, UserDataAction };
