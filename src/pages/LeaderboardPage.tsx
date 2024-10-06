import { IonThumbnail } from '@ionic/react';
import { FaMedal } from 'react-icons/fa';
import CoinGif from '@/assets/coins_animation.gif';

const LeaderboardPage = () => {
  const leaderboardData = [
    {
      username: 'AKZBDHEY__2',
      value: '$1,249,204',
      medalColor: 'text-yellow-300',
      profilePic: 'AK', // This could be a URL or initial letters
    },
    {
      username: 'AZABBBB232',
      value: '$144,444',
      medalColor: 'text-gray-400',
      profilePic: 'AZ',
    },
    {
      username: '@Z_BXXBB232',
      value: '$144,444',
      medalColor: 'text-orange-900',
      profilePic: 'Z_',
    },
    {
      username: 'AZABBBB232',
      value: '$144,444',
      profilePic: 'AZ',
    },
    {
      username: '@Z_BXXBB232',
      value: '$144,444',
      profilePic: 'Z_',
    },
  ];

  return (
    <div className="relative container p-7 w-screen bg-no-repeat bg-cover bg-center   ">
      <div className="text-center text-white mb-4 font-pixel">
        <img
          src={CoinGif}
          id="coin-click"
          alt="coin"
          className="w-1/2 h-1/2 mx-auto"
          aria-hidden
        />
        <div className="text-2xl font-bold">Leaderboard</div>
        <div className="text-sm">Best 100 Holders</div>
      </div>
      <div className="bg-gray-400 bg-opacity-25 rounded-xl">
        {leaderboardData.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between mb-4 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center text-white text-xl font-bold">
                <IonThumbnail>
                  <img
                    alt="Silhouette of mountains"
                    src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
                    className="rounded-full"
                  />
                </IonThumbnail>
              </div>
              <div className="text-left text-white font-arimo">
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm">{user.value}</div>
              </div>
            </div>

            {user.medalColor && (
              <div className="flex-shrink-0">
                <FaMedal className={`${user.medalColor} w-6 h-6`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
