import { TGameState } from './TGameState';

type TLeaderboardData = {
  users: TLeaderBoardItem[];
};

type TLeaderBoardItem = {
  first_name: string;
  last_name: string;
  user_name: string;
  photo_url: string;
  game_states: TGameState;
};

export type { TLeaderBoardItem, TLeaderboardData };
