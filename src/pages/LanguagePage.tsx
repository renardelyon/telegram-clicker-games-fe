import AccountOutlet from '@/components/AccountOutlet';
import { IonThumbnail } from '@ionic/react';

const languages = [
  { name: 'English', flag: '/assets/flags/uk.png' }, // Replace with the actual flag paths
  { name: 'Russian', flag: '/assets/flags/russia.png' },
  { name: 'Indonesian', flag: '/assets/flags/indonesia.png' },
  { name: 'Chinese', flag: '/assets/flags/china.png' },
  { name: 'Arabian', flag: '/assets/flags/uae.png' },
];

const LanguagePage = () => {
  return (
    <AccountOutlet>
      <div className="flex flex-col items-center justify-start h-screen bg-black p-6 font-pixel">
        {/* Language List */}
        <div className="space-y-4 w-full max-w-xs">
          {languages.map((language, index) => (
            <button
              key={index}
              className="flex items-center w-full bg-gray-600 rounded-lg px-4 py-4 text-white">
              {/* Flag */}
              <IonThumbnail className="mr-4">
                <img
                  alt="Silhouette of mountains"
                  src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
                  className="rounded-full"
                />
              </IonThumbnail>
              {/* Language Name */}
              <span className="text-lg font-bold">
                {language.name.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
      s
    </AccountOutlet>
  );
};

export default LanguagePage;
