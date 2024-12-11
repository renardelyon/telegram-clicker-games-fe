import UpgradeEnum from '@/enum/UpgradeEnum';

export type TUpgrade = {
  upgrade_id: string;
  next_cost: number;
  level: number;
  acquired_at: string;
};

export type TUpgradeDetail = {
  id: string;
  name: string;
  max_level: number;
  base_cost: number;
  description: string;
  effect: UpgradeEnum;
  inc_multiplier: number;
};

export type TUpgradeOverall = {
  upgrade: TUpgrade;
  upgrade_detail: TUpgradeDetail;
};
