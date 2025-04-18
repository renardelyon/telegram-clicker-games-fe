import { ISwap } from '@/interface/swap';
import { IonBadge } from '@ionic/react';
import React, { useState } from 'react';

const SwapPage: React.FC<SwapPageProps> = ({ swapFunc }) => {
  const [isBuying, setIsBuying] = useState(true);
  const {
    connect,
    disconnect,
    onChange,
    signAndSendTransaction,
    roundedBuyAmount,
    tokenName,
    walletStatus,
    walletPublicKey,
  } = swapFunc;

  return (
    <div className="relative container h-screen w-screen bg-cave bg-no-repeat bg-cover bg-center p-6 pt-12">
      {walletStatus === 'connected' && (
        <IonBadge color="light" className="text-base w-[80vw]">
          <p className="truncate">
            Connected to: {walletPublicKey?.toString()}
          </p>
        </IonBadge>
      )}
      <div className="h-screen flex flex-col items-center justify-start pt-[5vh]">
        <h2 className="text-white font-pixel ml-5 uppercase mb-10 text-xl">
          swap your coins here
        </h2>
        <div className="bg-[#203A68] rounded-2xl p-6 w-full max-w-md shadow-lg">
          {/* Buy/Sell Toggle */}
          <div className="flex bg-[#cfe7f2] rounded-full p-1 mb-4">
            <button
              className={`w-1/2 py-2 rounded-full font-bold ${
                isBuying ? 'bg-[#2C9CFF] text-white' : 'text-black'
              }`}
              onClick={() => setIsBuying(true)}>
              BUY
            </button>
            <button
              className={`w-1/2 py-2 rounded-full font-bold ${
                !isBuying ? 'bg-[#2C9CFF] text-white' : 'text-black'
              }`}
              onClick={() => setIsBuying(false)}>
              SELL
            </button>
          </div>

          {/* Input Box */}
          <div className="flex items-center justify-between bg-[#203A68] text-white text-lg font-semibold p-4 rounded-xl border-2 border-white mb-4">
            <input
              onChange={onChange}
              type="number"
              placeholder="0.0"
              className="bg-transparent outline-none w-full text-white text-lg font-semibold"
            />
            <span className="ml-4">SOL</span>
          </div>

          {Number(roundedBuyAmount) > 0 && (
            <p className="pb-4">{`${roundedBuyAmount?.toLocaleString() || 0} ${tokenName || ''}`}</p>
          )}

          {/* Trade Button */}
          <button
            onClick={signAndSendTransaction}
            className="bg-[#2C9CFF] hover:bg-blue-600 text-white font-bold py-3 w-full rounded-lg mb-4">
            Place Trade
          </button>
        </div>
        {walletStatus !== 'connected' ? (
          <button
            onClick={connect}
            className="uppercase bg-gray-400 text-gray-800 font-bold mt-7 py-4 w-full rounded-full tracking-widest text-lg hover:bg-gray-600">
            connect wallet
          </button>
        ) : (
          <button
            onClick={disconnect}
            className="uppercase bg-gray-400 text-gray-800 font-bold mt-7 py-4 w-full rounded-full tracking-widest text-base hover:bg-gray-600">
            disconnect wallet
          </button>
        )}
      </div>
    </div>
  );
};

type SwapPageProps = {
  swapFunc: ISwap;
};

export default SwapPage;
