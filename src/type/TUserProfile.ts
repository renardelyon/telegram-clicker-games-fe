import { TGameState } from './TGameState';
import { TReferral } from './TReferral';
import { TTask } from './TTask';
import { TUpgrade } from './TUpgrade';

export type TUserProfile = {
  _id: string;
  telegram_id: number;
  first_name: string;
  last_name?: string;
  user_name: string;
  photo_url: string;
  updated_at?: string;
  deleted_at?: string;
  created_at: string;
  language_code: string;
  is_premium: boolean;
  referral: TReferral;
  game_states: TGameState;
  upgrades: TUpgrade[];
  tasks: TTask[];
};
