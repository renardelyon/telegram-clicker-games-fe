import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonIcon,
} from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import BoosterItemDetailModal from './BoosterItemDetailModal';

const BoosterModal: React.FC<TBoosterModalProps> = ({ isOpen, setIsOpen }) => {
  const boosters = [
    { name: 'Multitap', price: 1000 },
    { name: 'Energy Limit', price: 200 },
    { name: 'Recharging Speed', price: 2000 },
    { name: 'Tap Bot', price: 200000 },
  ];
  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setIsOpen(false)} className="text-white">
              close
            </IonButton>
          </IonButtons>
          <IonTitle className="text-center font-pixel text-white">
            BOOSTERS
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="text-white">
        {/* Coins Section */}
        <div className="flex items-center justify-center my-24">
          <img
            src="https://via.placeholder.com/40" // Replace with actual coin image URL
            alt="Coin"
            className="w-10 h-10"
          />
          <span className="ml-4 text-2xl font-pixel">$2,747,874</span>
        </div>

        {/* Booster List */}
        <div className="px-6">
          {boosters.map((booster, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#203A68] text-white p-4 mb-4 rounded-3xl shadow-lg">
              {/* Booster Icon */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <img
                    src="https://via.placeholder.com/40" // Replace with actual booster icon URL
                    alt={booster.name}
                    className="w-6 h-6"
                  />
                </div>
                <div className="font-inter">
                  <div className="font-semibold">{booster.name}</div>
                  <div className="flex items-center text-sm font-normal">
                    <img
                      src="https://via.placeholder.com/16" // Replace with coin icon
                      alt="Coin Icon"
                      className="w-4 h-4 mr-1"
                    />
                    {booster.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="text-white text-lg">
                <IonIcon icon={chevronForwardOutline} className="text-3xl" />
              </div>
            </div>
          ))}
        </div>
      </IonContent>
      <BoosterItemDetailModal />
    </IonModal>
  );
};

type TBoosterModalProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

export default BoosterModal;
