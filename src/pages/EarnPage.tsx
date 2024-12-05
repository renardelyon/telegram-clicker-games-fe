import { IonCard, IonCardContent } from '@ionic/react';

import coin from '@/assets/coin.svg';
import { useEffect, useMemo, useState } from 'react';
import { TbPick } from 'react-icons/tb';
import ButtonTransparent from '@/components/ButtonTransparent';
import useBoundStore from '@/store/store';
import useTaps from '@/hooks/useTaps';
import { useGetUpgrades } from '@/api/upgrades';
import UpgradeEnum from '@/enum/UpgradeEnum';
import errorHandler from '@/utils/error';
import BoosterModal from '@/components/BoosterModal';

const EarnPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setErrorToast = useBoundStore.use.setErrorToast();
  const incrementEnergy = useBoundStore.use.incrementEnergy();
  const setEnergy = useBoundStore.use.setEnergy();
  const states = useBoundStore.use.user().game_states;

  const {
    data: upgradeData,
    error: upgradeErr,
    isError: upgradeIsError,
  } = useGetUpgrades();

  useEffect(() => {
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
  }, [upgradeIsError, upgradeErr]);

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
            {states.energy}/{maxEnergy}
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
        <BoosterModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </>
  );
};

export default EarnPage;
