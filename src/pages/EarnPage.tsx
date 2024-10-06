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
import { BiCoinStack } from 'react-icons/bi';

const EarnPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [clicks, setClicks] = useState<{ [key: string]: number }[]>([]);

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
        <IonCard>
          <IonCardContent className="grid grid-cols-2 divide-x-4 font-pixel text-3xl text-white">
            <div className="flex items-center justify-center gap-4">
              <BiCoinStack className="mb-1" />
              <h2>10000</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <TbPick className="mb-1" />
              <h2>10000</h2>
            </div>
          </IonCardContent>
        </IonCard>
        <div className="flex pb-20 px-10 justify-center align-center w-auto h-screen">
          <img
            src={coin}
            id="coin-click"
            alt="coin"
            className="w-auto h-4/6"
            onClick={handleClick}
            aria-hidden
          />
        </div>

        <div className="flex flex-row text-md items-center fixed z-10 bottom-0 font-pixel pb-6 w-screen px-7">
          <div className="basis-1/2">
            <p className="text-left">500/500</p>
          </div>
          <div className="basis-1/2 flex justify-end">
            <button
              className="flex items-center bg-gray-300 bg-opacity-70 text-white font-bold py-4 px-4 rounded-lg shadow-md hover:bg-gray-600"
              onClick={() => setIsOpen(true)}>
              {/* Rocket Icon (You can replace with an SVG or image) */}
              <span
                role="img"
                aria-label="rocket"
                className="mr-2 text-2xl justify-self-start -mt-3">
                🚀
              </span>
              {/* Boost Text */}
              BOOST
            </button>
          </div>
        </div>
        {clicks.map(elem => (
          <span
            key={elem.id}
            className="absolute text-3xl color text-orange-300 animate-fadeUp"
            style={{ left: elem.left, top: elem.top }}>
            +1
          </span>
        ))}
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
