import { useCheckTelegramMembership } from '@/api/authUser';
import { useRedeemTaskRewards } from '@/api/task';
import TaskDescEnum from '@/enum/TaskDescEnum';
import TaskStatusEnum from '@/enum/TaskStatusEnum';
import useBoundStore from '@/store/store';
import errorHandler from '@/utils/error';
import webApp from '@twa-dev/sdk';
import {
  VITE_BOT_APP,
  VITE_TELEGRAM_GROUP_LINK,
  VITE_TIKTOK_USERNAME,
  VITE_TWITTER_USERNAME,
} from '@/env/env';
import { UseGetMyReferral } from '@/api/referral';

type HandleFn = (...args: string[]) => () => void;

const useTask = (): TUseTaskResult => {
  const resetErrorToast = useBoundStore.use.resetErrorToast();
  const setErrorToast = useBoundStore.use.setErrorToast();
  const { telegram_id: userId } = useBoundStore.use.user();

  const taskMutate = useRedeemTaskRewards({
    successSideEffect: () => {
      resetErrorToast();
    },
    onError: err => {
      errorHandler({
        error: err,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    },
  });

  const { refetch: myReferralRefetch, isLoading: myReferralIsLoading } =
    UseGetMyReferral({ enabled: false });
  const { refetch: checkTelegramRefetch, isLoading: checkTelegramIsLoading } =
    useCheckTelegramMembership({
      enabled: false,
    });

  const handleInviteFriendsClick = (taskId: string) => async () => {
    const res = await myReferralRefetch();

    const newUserReferred = res.data?.data.data?.new_user_referred ?? 0;

    if (newUserReferred <= 0) {
      const inviteLink = `${VITE_BOT_APP}?startapp=${userId}`;
      const shareText = `Join me on this awesome Telegram mini app!`;
      const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;

      webApp.openTelegramLink(fullUrl);

      return;
    }

    taskMutate.mutate({ status: TaskStatusEnum.INCOMPLETE, task_id: taskId });
  };

  const handleFollowTwitterClick = (taskId: string) => () => {
    const url = `https://twitter.com/intent/follow?screen_name=${VITE_TWITTER_USERNAME}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    taskMutate.mutate({ status: TaskStatusEnum.COMPLETE, task_id: taskId });
  };

  const handleFollowTiktokClick = (taskId: string) => () => {
    const url = `https://www.tiktok.com/${VITE_TIKTOK_USERNAME}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    taskMutate.mutate({ status: TaskStatusEnum.COMPLETE, task_id: taskId });
  };

  const handleTelegramClick: HandleFn = (taskId: string) => async () => {
    const res = await checkTelegramRefetch();

    if (res.isSuccess) {
      resetErrorToast();
    }

    if (res.isError) {
      errorHandler({
        error: res.error,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });

      return;
    }

    if (!res.data?.data.data?.isMember) {
      taskMutate.mutate({ status: TaskStatusEnum.COMPLETE, task_id: taskId });
      return;
    }

    webApp.openTelegramLink(VITE_TELEGRAM_GROUP_LINK);
  };

  const handleDailyClick: HandleFn = (taskId: string) => () => {
    taskMutate.mutate({ status: TaskStatusEnum.COMPLETE, task_id: taskId });
  };

  return {
    functionHandlerMap: {
      [TaskDescEnum.DAILY_CHECKIN]: handleDailyClick,
      [TaskDescEnum.FOLLOW_TIKTOK]: handleFollowTiktokClick,
      [TaskDescEnum.FOLLOW_TWITTER]: handleFollowTwitterClick,
      [TaskDescEnum.INVITE_FRIENDS]: handleInviteFriendsClick,
      [TaskDescEnum.SUBSCRIBE_TELEGRAM]: handleTelegramClick,
      [TaskDescEnum.WATCH_ADS]: () => () => {},
    },
    isLoading:
      myReferralIsLoading || checkTelegramIsLoading || taskMutate.isPending,
  };
};

type TUseTaskResult = {
  functionHandlerMap: Record<TaskDescEnum, HandleFn>;
  isLoading: boolean;
};

export default useTask;
