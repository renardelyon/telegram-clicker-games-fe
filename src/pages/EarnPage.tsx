import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import coin from '@/assets/coin.svg';
import React, { useState } from 'react';
import { TbPick } from 'react-icons/tb';
import ButtonTransparent from '@/components/ButtonTransparent';
import useBoundStore from '@/store/store';

const EarnPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [clicks, setClicks] = useState<{ [key: string]: number }[]>([]);

  const states = useBoundStore.use.user().game_states;

  const handleClick = (e: React.MouseEvent) => {
    const newClick = {
      id: Date.now(),
      left: e.clientX,
      top: e.clientY,
    };

    setClicks(prev => [...prev, newClick]);

    setTimeout(() => {
      setClicks(prev => prev.filter(click => click.id !== newClick.id));
    }, 1000);
  };

  return (
    <>
      <div className="relative container h-screen w-screen bg-no-repeat bg-cover bg-center">
        {/* Header Section */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center py-7 px-4 text-white font-pixel text-lg z-10">
          <div className="flex items-center h-full">
            <ButtonTransparent onClick={() => setIsOpen(true)}>
              <span
                role="img"
                aria-label="rocket"
                className="mr-2 text-2xl justify-self-start -mt-3">
                🚀
              </span>
              {/* Boost Text */}
              <h6>BOOST</h6>
            </ButtonTransparent>
          </div>
          <div className="flex items-center h-full">
            <IonCard className="bg-gray-300 bg-opacity-70 rounded-lg shadow-md">
              <IonCardContent className="font-pixel text-3xl text-white">
                <div className="flex items-center justify-center gap-4">
                  <TbPick className="mb-1" />
                  <h6>{states.mining_rate}</h6>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        {/* Main Coin Section */}
        <div className="flex flex-col items-center justify-center h-full">
          <img
            src={coin}
            id="coin-click"
            alt="coin"
            className="w-auto h-4/6"
            onClick={handleClick}
            aria-hidden
          />
          <h2 className="text-white font-pixel mt-4">${states.balance}</h2>
          <p className="text-white font-pixel text-xl mt-2">
            {states.energy}/{states.base_energy}
          </p>
        </div>

        {/* Click Effects */}
        {clicks.map(elem => (
          <span
            key={elem.id}
            className="absolute text-3xl text-orange-300 font-pixel animate-fadeUp"
            style={{ left: elem.left, top: elem.top }}>
            +1
          </span>
        ))}

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-6 pb-4 text-white font-pixel text-md">
          <div className="basis-1/2 text-left">500/500</div>
          <ButtonTransparent
            onClick={() => setIsOpen(true)}
            className="basis-1/2 text-right">
            <span role="img" aria-label="rocket" className="text-2xl -mt-2">
              🚀
            </span>
            BOOST
          </ButtonTransparent>
        </div>

        {/* Modal */}
        <IonModal trigger="open-modal" isOpen={isOpen}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Boost</IonTitle>
            </IonToolbar>
          </IonHeader>
        </IonModal>
      </div>
    </>
  );
};

export default EarnPage;
