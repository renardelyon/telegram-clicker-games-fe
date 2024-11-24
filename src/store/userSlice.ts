import { UserData, UserDataSlice } from '@/type/TUserDataSlice';
import { StateCreator } from 'zustand';

const initialValue: UserData = {
  user: {
    _id: '',
    created_at: '',
    first_name: '',
    game_states: {
      balance: 0,
      click_count: 0,
      energy: 0,
      last_energy_update: '',
      max_energy: 0,
      mining_rate: 0,
      total_balance: 0,
    },
    is_premium: false,
    language_code: '',
    referral: {
      referrals: [],
      referred_by: 0,
    },
    tasks: [],
    telegram_id: 0,
    upgrades: [],
    user_name: '',
    deleted_at: '',
    last_name: '',
    updated_at: '',
  },
};

const createUserSlice: StateCreator<
  UserDataSlice,
  [],
  [],
  UserDataSlice
> = set => {
  return {
    ...initialValue,
    setUserData: val => set(state => ({ ...state, ...val })),
  };
};

export default createUserSlice;
