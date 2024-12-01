import AccountOutlet from '@/components/AccountOutlet';
import { IonThumbnail } from '@ionic/react';

const languages = [
  { name: 'English', flag: '/assets/flags/uk.png' }, // Replace with the actual flag paths
];

const LanguagePage = () => {
  return (
    <AccountOutlet>
      <div className="flex flex-col items-center justify-start font-pixel py-10">
        {/* Language List */}
        <div className="space-y-4 w-full max-w-xs">
          {languages.map((language, index) => (
            <button
              key={index}
              className="flex items-center w-full bg-[#203A68] rounded-2xl px-4 py-4 text-white">
              {/* Flag */}
              <IonThumbnail className="mr-4">
                <img
                  alt="Silhouette of mountains"
                  src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
                  className="rounded-full"
                />
              </IonThumbnail>
              {/* Language Name */}
              <span className="text-xl font-bold">
                {language.name.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </AccountOutlet>
  );
};

export default LanguagePage;
