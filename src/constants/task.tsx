import TaskDescEnum from '@/enum/TaskDescEnum';
import GiftDailyRewards from '@/assets/gift_daily_rewards.svg?react';
import React from 'react';
import {
  FaTelegramPlane,
  FaTiktok,
  FaTwitter,
  FaUserFriends,
} from 'react-icons/fa';
import { MdLiveTv } from 'react-icons/md';

export const TaskToIcon: Readonly<Record<TaskDescEnum, React.ReactElement>> = {
  [TaskDescEnum.WATCH_ADS]: <MdLiveTv className="mr-4 text-3xl" />,
  [TaskDescEnum.DAILY_CHECKIN]: <GiftDailyRewards className="mr-2" />,
  [TaskDescEnum.FOLLOW_TIKTOK]: <FaTiktok className="mr-4 text-3xl" />,
  [TaskDescEnum.FOLLOW_TWITTER]: <FaTwitter className="mr-4 text-3xl" />,
  [TaskDescEnum.SUBSCRIBE_TELEGRAM]: (
    <FaTelegramPlane className="mr-4 text-3xl" />
  ),
  [TaskDescEnum.INVITE_FRIENDS]: <FaUserFriends className="mr-4 text-3xl" />,
};
