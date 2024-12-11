import { IonCard, IonCardContent, IonProgressBar } from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import { TbPick } from 'react-icons/tb';
import ButtonTransparent from '@/components/ButtonTransparent';
import useBoundStore from '@/store/store';
import useTaps from '@/hooks/useTaps';
import { useGetUpgrades } from '@/api/upgrades';
import UpgradeEnum from '@/enum/UpgradeEnum';
import errorHandler from '@/utils/error';
import BoosterModal from '@/components/BoosterModal';
import '@/style/css/EarnPage.css';
import { TUpgradeOverall } from '@/type/TUpgrade';

const EarnPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [upgrades, setUpgrades] = useState<TUpgradeOverall[]>();

  const resetErrorToast = useBoundStore.use.resetErrorToast();
  const setErrorToast = useBoundStore.use.setErrorToast();
  const incrementEnergy = useBoundStore.use.incrementEnergy();
  const setEnergy = useBoundStore.use.setEnergy();
  const states = useBoundStore.use.user().game_states;

  const {
    data: upgradeData,
    error: upgradeErr,
    isSuccess: upgradeIsSuccess,
    isError: upgradeIsError,
  } = useGetUpgrades();

  useEffect(() => {
    if (upgradeIsSuccess) {
      resetErrorToast();
      setUpgrades(upgradeData.data.data);
    }
    if (upgradeIsError) {
      errorHandler({
        error: upgradeErr,
        axiosErrorHandlerFn: errMsg => {
          setErrorToast({ isOpen: true, message: errMsg || '' });
        },
        generalErrorHandlerFn: err => {
          setErrorToast({ isOpen: true, message: err.message || '' });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upgradeIsError, upgradeErr, upgradeIsSuccess, upgradeData]);

  const multiTapUpgrade = useMemo(() => {
    return upgradeData?.data.data
      ?.filter(val => val.upgrade_detail.effect === UpgradeEnum.MULTI_TAP)
      .shift();
  }, [upgradeData]);

  const energyRechargeUpgrade = useMemo(() => {
    return upgradeData?.data.data
      ?.filter(val => val.upgrade_detail.effect === UpgradeEnum.ENERGY_RECHARGE)
      .shift();
  }, [upgradeData]);

  const maxEnergy = useMemo(() => {
    const energyLimitUpgrade = upgradeData?.data.data
      ?.filter(val => val.upgrade_detail.effect === UpgradeEnum.ENERGY_LIMIT)
      .shift();

    return states.base_energy * (energyLimitUpgrade?.upgrade.level || 1);
  }, [upgradeData, states.base_energy]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (states.energy >= maxEnergy) {
        return;
      }

      const incrementedEnergy = (() => {
        const incrementUnit = energyRechargeUpgrade?.upgrade.level || 0;
        if (states.energy + incrementUnit > maxEnergy) {
          return states.energy + incrementUnit - maxEnergy;
        }

        return incrementUnit;
      })();

      incrementEnergy(incrementedEnergy);
    }, 1000);

    return () => clearInterval(interval);
  }, [
    states.energy,
    maxEnergy,
    incrementEnergy,
    setEnergy,
    energyRechargeUpgrade?.upgrade.level,
  ]);

  const { clicks, handleClick } = useTaps(multiTapUpgrade);

  return (
    <>
      <div className="relative container h-screen w-screen bg-cave bg-no-repeat bg-cover bg-center">
        {/* Header Section */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center py-7 px-4 text-white font-pixel text-lg z-10">
          <div className="flex items-center h-full">
            <ButtonTransparent
              onClick={() => setIsOpen(true)}
              className="py-2 px-3 grad-color-bg-meme-coin">
              <span
                role="img"
                aria-label="rocket"
                className="mr-2 text-2xl translate-y-[-5px]">
                🚀
              </span>
              {/* Boost Text */}
              <h6>BOOST</h6>
            </ButtonTransparent>
          </div>
          <div className="ion-card-mining flex items-center h-full">
            <IonCard className="grad-color-bg-meme-coin bg-opacity-70 rounded-lg shadow-md">
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
          {/* Coins Section */}
          <div className="flex items-center justify-center">
            <img
              src="https://via.placeholder.com/40" // Replace with actual coin image URL
              alt="Coin"
              className="w-10 h-10"
            />
            <h2 className="text-white font-pixel ml-5">${states.balance}</h2>
          </div>
          <img
            src="/doge_char.png"
            id="coin-click"
            alt="coin"
            className="w-auto"
            onClick={handleClick}
            aria-hidden
          />
          <div className="w-full max-w-md mx-auto mt-6">
            {/* Progress Bar Container */}
            <div className="relative">
              <IonProgressBar
                value={0.6}
                className="h-4 progress-bar-energy rounded-2xl"
              />

              {/* Energy Info */}
              <div className="flex justify-end items-center mt-2 text-white text-sm font-pixel">
                <img
                  src="/path/to/lightning-icon.png" // Replace with your lightning icon path
                  alt="Lightning"
                  className="w-5 h-5 mr-2"
                />
                <p className="text-white font-pixel text-xl mt-2">
                  {states.energy}/{maxEnergy}
                </p>
              </div>
            </div>
          </div>
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
        {/* Modal */}
        <BoosterModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          upgrades={upgrades || []}
        />
      </div>
    </>
  );
};

export default EarnPage;
