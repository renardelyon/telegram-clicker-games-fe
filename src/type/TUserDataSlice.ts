import { TUserProfile } from '@/type/TUserProfile';

type UserData = {
  user: TUserProfile;
};

type UserDataAction = {
  setUserData: (val?: TUserProfile) => void;
};

type UserDataSlice = UserData & UserDataAction;

export type { UserData, UserDataSlice, UserDataAction };
