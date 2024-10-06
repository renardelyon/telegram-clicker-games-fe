import ButtonTransparent from '@/components/ButtonTransparent';

const SwapPage = () => {
  return (
    <div className="relative container h-screen w-screen bg-no-repeat bg-cover bg-center p-6 pt-12">
      <div className="h-screen flex flex-col items-center justify-start">
        {/* Connect Wallet Button */}
        <div className="flex justify-end w-full mb-4">
          <ButtonTransparent className="rounded-3xl">
            <span
              role="img"
              aria-label="rocket"
              className="mr-1 text-2xl justify-self-start -mt-2">
              💵
            </span>
            CONNECT WALLET
          </ButtonTransparent>
        </div>

        {/* Swap Title */}
        <h1 className="text-2xl max-w-xs text-white font-bold text-center mt-6 mb-6 font-pixel">
          Swap Your Coins Here!!
        </h1>

        {/* Swap Box */}
        <div className="bg-black rounded-lg p-6 w-full max-w-md">
          {/* Buy/Sell Buttons */}
          <div className="flex justify-between mb-4">
            <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg w-1/2 mr-2">
              BUY
            </button>
            <button className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg w-1/2">
              SELL
            </button>
          </div>

          {/* Token and Set Max Buttons */}
          <div className="flex justify-between text-white text-sm mb-4">
            <button className="bg-gray-700 rounded-lg py-2 px-4 w-1/2 mr-2">
              Switch to TOKEN
            </button>
            <button className="bg-gray-700 rounded-lg py-2 px-4 w-1/2">
              Set max
            </button>
          </div>

          {/* Input Section */}
          <div className="flex items-center justify-between bg-gray-800 text-white p-4 rounded-lg mb-4">
            <input
              type="text"
              placeholder="0.0"
              className="bg-transparent outline-none text-2xl w-full"
            />
            <span className="text-2xl">SOL</span>
          </div>

          {/* Reset & SOL Options */}
          <div className="flex justify-between text-white text-sm mb-4">
            <button className="bg-gray-700 rounded-lg py-2 px-4">Reset</button>
            <div className="flex space-x-2">
              <button className="bg-gray-700 rounded-lg py-2 px-4">
                1 SOL
              </button>
              <button className="bg-gray-700 rounded-lg py-2 px-4">
                5 SOL
              </button>
              <button className="bg-gray-700 rounded-lg py-2 px-4">
                10 SOL
              </button>
            </div>
          </div>

          {/* Disabled Button */}
          <button
            disabled
            className="bg-gray-500 text-white font-bold py-4 w-full rounded-lg opacity-50">
            DISABLED FOR NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
