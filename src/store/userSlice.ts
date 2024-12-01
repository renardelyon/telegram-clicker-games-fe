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
      base_energy: 0,
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
    setUserData: val => set(state => ({ ...state, user: val })),
    addBalance: val =>
      set(state => ({
        user: {
          ...state.user,
          game_states: {
            ...state.user.game_states,
            balance: state.user.game_states.balance + val,
            total_balance: state.user.game_states.total_balance + val,
          },
        },
      })),
    decrementEnergy: val =>
      set(state => ({
        user: {
          ...state.user,
          game_states: {
            ...state.user.game_states,
            energy: state.user.game_states.energy - val,
          },
        },
      })),
    incrementEnergy: val =>
      set(state => ({
        user: {
          ...state.user,
          game_states: {
            ...state.user.game_states,
            energy: state.user.game_states.energy + val,
          },
        },
      })),
    setEnergy: val =>
      set(state => ({
        user: {
          ...state.user,
          game_states: {
            ...state.user.game_states,
            energy: val,
          },
        },
      })),
  };
};

export default createUserSlice;
