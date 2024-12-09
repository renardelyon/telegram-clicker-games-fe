import { useGetLeaderboard } from '@/api/leaderboard';
import useBoundStore from '@/store/store';
import { TLeaderboardData } from '@/type/TLeaderboardData';
import errorHandler from '@/utils/error';
import { IonThumbnail } from '@ionic/react';
import { useEffect, useState } from 'react';

const LeaderboardPage = () => {
  const resetErrorToast = useBoundStore.use.resetErrorToast();
  const setErrorToast = useBoundStore.use.setErrorToast();
  const [leaderboardData, setLeaderboardData] = useState<TLeaderboardData>({
    users: [],
  });

  const {
    data: leaderboardDataResp,
    error: leaderboardError,
    isError: leaderboardIsError,
    isSuccess: leaderboardIsSuccess,
  } = useGetLeaderboard(100);

  useEffect(() => {
    if (leaderboardIsSuccess) {
      setLeaderboardData(leaderboardDataResp.data.data || { users: [] });
      resetErrorToast();
    }

    if (leaderboardIsError) {
      errorHandler({
        error: leaderboardError,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    leaderboardData,
    leaderboardError,
    leaderboardIsError,
    leaderboardIsSuccess,
  ]);

  return (
    <div
      id="leaderboard-page"
      className="relative bg-[#020D2F]  h-screen flex flex-col text-white">
      {/* Leaderboard Header */}
      <div className="text-center p-10 font-pixel">
        <h1 className="text-2xl">LEADERBOARD</h1>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end">
        {leaderboardData.users.slice(0, 3).map((user, index) => {
          const order =
            index === 0
              ? 'order-2 ml-4'
              : index === 1
                ? 'order-1'
                : 'order-3 ml-4';
          const height = index === 0 ? 'h-40' : index === 1 ? 'h-32' : 'h-28';
          const bgColor =
            index === 0
              ? 'bg-[#1D97F1]'
              : index === 1
                ? 'bg-[#975CE4]'
                : 'bg-[#4E81AB]';

          return (
            <div key={index} className={`flex flex-col items-center ${order}`}>
              {/* Profile Picture */}
              <div className={`w-16 h-16 rounded-full overflow-hidden mb-2`}>
                <img src={user.photo_url} alt={user.first_name} />
              </div>
              {/* Podium Bar */}
              <div
                className={`flex justify-center items-center ${bgColor} ${height} w-24 rounded-t-3xl`}>
                <h2 className="text-xl font-bold">{`0${index + 1}`}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Best 100 Holders */}
      <div className="flex-1 bg-[#203A68] rounded-t-xl p-6 overflow-hidden">
        <h2 className="text-center text-lg font-bold my-6 uppercase">
          Best 100 Holders
        </h2>
        <div className="h-[400px] overflow-y-auto">
          {leaderboardData.users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-start bg-[#1D97F1] p-4 mb-4 rounded-lg">
              <div className="flex items-center space-x-3">
                {/* Position */}
                <h2 className="text-xl font-bold">{`0${index + 1}`}</h2>
                {/* Profile Picture */}
                <IonThumbnail>
                  <img
                    src={user.photo_url}
                    alt={user.first_name}
                    className="rounded-full"
                  />
                </IonThumbnail>
                {/* User Details */}
                <div className="text-left">
                  <div className="text-lg font-semibold">
                    {user.user_name || `${user.first_name} ${user.last_name}`}
                  </div>
                  <div className="text-sm text-white">
                    ${user.game_states.balance}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
