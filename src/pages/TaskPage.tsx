import { IonThumbnail } from '@ionic/react';
import CatLoading from '@/assets/cat_loading.gif';

// Sample data for earning coins options
const earnMoreCoinsOptions = [
  {
    title: 'Subscribe Telegram Channel',
    coins: '+20,000',
    icon: '/assets/icons/telegram.png', // Assuming you have these icons stored locally
  },
  {
    title: 'Watch Ads',
    coins: '+20,000',
    icon: '/assets/icons/ads.png',
  },
  {
    title: 'Follow X Account',
    coins: '+20,000',
    icon: '/assets/icons/x_account.png',
  },
  {
    title: 'Daily Rewards',
    coins: '+20,000',
    icon: '/assets/icons/daily_rewards.png',
  },
];

const TaskPage = () => {
  return (
    <div className="relative container p-7 w-screen bg-no-repeat bg-cover bg-center">
      {/* Cat Image */}
      <div className="flex justify-center mb-4">
        <img
          src={CatLoading}
          alt="Earn More Coins"
          className="w-2/3 h-2/3 mx-auto"
        />
      </div>

      {/* Title */}
      <div className="text-center text-white text-xl font-pixel font-bold mb-6 -mt-10">
        Earn More Coins
      </div>

      {/* Coin Options */}
      {earnMoreCoinsOptions.map((option, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-4 mb-4 rounded-3xl bg-gray-400 bg-opacity-25`}>
          <div className="flex items-center justify-center space-x-6 w-full">
            {/* Icon */}
            <IonThumbnail className="w-[25%]">
              <img
                alt="Silhouette of mountains"
                src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
                className="rounded-full w-full h-full"
              />
            </IonThumbnail>
            {/* Title */}
            <div className="flex flex-col text-left w-[75%]">
              <div className="text-white font-semibold font-pixel text-sm">
                {option.title}
              </div>
              {/* Coin Count */}
              <div className="text-white font-bold font-arimo">
                {option.coins}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskPage;
