import { useGetReferrals } from '@/api/referral';
import AccountOutlet from '@/components/AccountOutlet';
import { VITE_BOT_APP } from '@/env/env';
import useBoundStore from '@/store/store';
import { TUserProfile } from '@/type/TUserProfile';
import errorHandler from '@/utils/error';
import { IonThumbnail } from '@ionic/react';
import { useEffect, useState } from 'react';
// import { openTelegramLink } from '@telegram-apps/sdk';

const ReferralPage = () => {
  const [referrals, setReferrals] = useState<TUserProfile[]>();
  const currUser = useBoundStore.use.user();
  const resetErrorToast = useBoundStore.use.resetErrorToast();
  const setErrorToast = useBoundStore.use.setErrorToast();

  // TODO: for claim rewards
  // const handleInviteFriend = () => {
  //   const inviteLink = `${VITE_BOT_APP}?startapp=${userId}`;
  //   const shareText = `Join me on this awesome Telegram mini app!`;
  //   const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
  //   openTelegramLink(fullUrl);
  // };

  const {
    data: referralData,
    error: referralError,
    isError: referralIsError,
    isSuccess: referralIsSuccess,
  } = useGetReferrals();

  useEffect(() => {
    if (referralIsSuccess) {
      resetErrorToast();
      setReferrals(referralData.data.data);
    }

    if (referralIsError) {
      errorHandler({
        error: referralError,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralData, referralError, referralIsError, referralIsSuccess]);

  const handleCopyLink = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const inviteLink = `${VITE_BOT_APP}?startapp=${currUser.telegram_id}`;
    navigator.clipboard.writeText(inviteLink);
  };

  return (
    <AccountOutlet>
      {/* User Information */}
      <div className="flex flex-col items-center my-8">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-2">
          <img
            src={currUser.photo_url} // Replace with actual profile picture
            alt={currUser.user_name || currUser.first_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-lg font-bold">
          {currUser.user_name || `${currUser.first_name} ${currUser.last_name}`}
        </div>
        <div className="bg-gradient-to-r from-[#1D97F1] to-[#203A68] rounded-full px-4 py-1 mt-2 font-bold">
          <h2 className="text-sm">{currUser.game_states.balance}</h2>
        </div>
        <button
          className="mt-2 text-md text-white underline italic"
          onClick={handleCopyLink}>
          My Referral Link
        </button>
      </div>

      {/* Referrals List Section */}
      <div className="flex-1 bg-[#203A68] rounded-t-xl p-6 overflow-hidden">
        <h2 className="text-center text-lg font-bold my-6 uppercase">
          my referrals list
        </h2>
        <div className="h-[400px] overflow-y-auto">
          {(referrals || []).map((user, index) => {
            const position = index + 1;
            return (
              <div
                key={index}
                className="flex items-center justify-start bg-[#1D97F1] p-4 mb-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  {/* Position */}
                  <h2 className="text-xl font-bold">
                    {position < 10 ? `0${position}` : `${position}`}
                  </h2>
                  {/* Profile Picture */}
                  <IonThumbnail>
                    <img
                      src={user.photo_url}
                      alt={
                        user.user_name || `${user.first_name} ${user.last_name}`
                      }
                      className="rounded-full"
                    />
                  </IonThumbnail>
                  {/* User Details */}
                  <div className="text-left">
                    <div className="text-lg font-semibold">
                      {user.user_name || `${user.first_name} ${user.last_name}`}
                    </div>
                    <div className="text-sm text-gray-300">
                      {user.game_states.total_balance}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AccountOutlet>
  );
};

export default ReferralPage;
