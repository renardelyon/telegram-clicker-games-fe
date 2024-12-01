import AccountOutlet from '@/components/AccountOutlet';
import { IonThumbnail } from '@ionic/react';

// const referralData = [
//   {
//     name: 'AZABBBB232',
//     value: '$144,444',
//     avatar: 'AZ',
//   },
//   {
//     name: '@Z_BXXBB232',
//     value: '$144,444',
//     avatar: 'Z_',
//   },
//   {
//     name: 'AZABBBB232',
//     value: '$144,444',
//     avatar: 'AZ',
//   },
// ];

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

const ReferralPage = () => {
  return (
    <AccountOutlet>
      {/* User Information */}
      <div className="flex flex-col items-center my-8">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-2">
          <img
            src="https://via.placeholder.com/100" // Replace with actual profile picture
            alt="@personal_user"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-lg font-bold">@personal_user</div>
        <div className="bg-gradient-to-r from-[#1D97F1] to-[#203A68] rounded-full px-4 py-1 mt-2 font-bold">
          <h2 className="text-sm"> $ 2,747,847</h2>
        </div>
        <a className="mt-2 text-md text-white underline italic" href="/#">
          My Referral Link
        </a>
      </div>

      {/* Referrals List Section */}
      <div className="flex-1 bg-[#203A68] rounded-t-xl p-6 overflow-hidden">
        <h2 className="text-center text-lg font-bold my-6 uppercase">
          my referrals list
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
    </AccountOutlet>
  );
};

export default ReferralPage;
