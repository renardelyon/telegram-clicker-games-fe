import { IonThumbnail } from '@ionic/react';

const LeaderboardPage = () => {
  const leaderboardData = [
    {
      username: '@user1',
      value: '$15,000,000',
      position: 1,
      profilePic: 'https://via.placeholder.com/100', // Replace with actual profile image URL
    },
    {
      username: '@user2',
      value: '$12,000,000',
      position: 2,
      profilePic: 'https://via.placeholder.com/100', // Replace with actual profile image URL
    },
    {
      username: '@user3',
      value: '$9,000,000',
      position: 3,
      profilePic: 'https://via.placeholder.com/100', // Replace with actual profile image URL
    },
  ];

  return (
    <div
      id="leaderboard-page"
      className="relative bg-[#020D2F]  h-screen flex flex-col text-white">
      {/* Leaderboard Header */}
      <div className="text-center p-10 font-pixel">
        <h1 className="text-2xl">LEADERBOARD</h1>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end space-x-4">
        {leaderboardData.slice(0, 3).map((user, index) => {
          const height = index === 0 ? 'h-32' : index === 1 ? 'h-40' : 'h-28';
          const bgColor =
            index === 0
              ? 'bg-[#1D97F1]'
              : index === 1
                ? 'bg-[#975CE4]'
                : 'bg-[#4E81AB]';

          return (
            <div key={user.position} className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className={`w-16 h-16 rounded-full overflow-hidden mb-2`}>
                <img src={user.profilePic} alt={user.username} />
              </div>
              {/* Podium Bar */}
              <div
                className={`flex justify-center items-center ${bgColor} ${height} w-24 rounded-t-3xl`}>
                <h2 className="text-xl font-bold">{`0${user.position}`}</h2>
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
          {leaderboardData.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-start bg-[#1D97F1] p-4 mb-4 rounded-lg">
              <div className="flex items-center space-x-3">
                {/* Position */}
                <h2 className="text-xl font-bold">{`0${user.position}`}</h2>
                {/* Profile Picture */}
                <IonThumbnail>
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    className="rounded-full"
                  />
                </IonThumbnail>
                {/* User Details */}
                <div className="text-left">
                  <div className="text-lg font-semibold">{user.username}</div>
                  <div className="text-sm text-gray-300">{user.value}</div>
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
