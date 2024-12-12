import { IonCard, IonCardContent, IonProgressBar } from '@ionic/react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import CoinSVG from '@/assets/coin_pixel.svg';
import { BsFillLightningChargeFill } from 'react-icons/bs';

const EarnPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [upgrades, setUpgrades] = useState<TUpgradeOverall[]>();
  const intervalRef = useRef<number | null>(null);

  const resetErrorToast = useBoundStore.use.resetErrorToast();
  const setErrorToast = useBoundStore.use.setErrorToast();
  const incrementEnergyWithCallback =
    useBoundStore.use.incrementEnergyWithCallback();
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

  const progressBarValue = useMemo(() => {
    return states.energy / maxEnergy;
  }, [states.energy, maxEnergy]);

  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      incrementEnergyWithCallback(energy => {
        if (energy >= maxEnergy) {
          return 0;
        }

        const incrementedEnergy = (() => {
          const incrementUnit = energyRechargeUpgrade?.upgrade.level || 0;
          if (energy + incrementUnit > maxEnergy) {
            return maxEnergy - energy;
          }

          return incrementUnit;
        })();

        return incrementedEnergy;
      });
    }, 1000);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startInterval();

    return () => stopInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxEnergy, energyRechargeUpgrade?.upgrade.level]);

  const { clicks, handleClick, handleAnimationEnd } = useTaps(
    startInterval,
    stopInterval,
    multiTapUpgrade,
  );

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
          {/* Change hidden to flex if mining rate logic have been determined */}
          <div className="ion-card-mining items-center h-full hidden">
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
              src={CoinSVG} // Replace with actual coin image URL
              alt="Coin"
              className="w-10 h-10"
            />
            <h2 className="text-white font-pixel ml-5">
              {states.balance.toLocaleString()}
            </h2>
          </div>
          <div onClick={handleClick} aria-hidden>
            <img
              src="/doge_char.png"
              id="coin-click"
              alt="coin"
              className="w-auto"
            />
          </div>
          <div className="w-full max-w-md mx-auto mt-6">
            {/* Progress Bar Container */}
            <div className="relative">
              <IonProgressBar
                value={progressBarValue}
                className="h-4 progress-bar-energy rounded-2xl"
              />

              {/* Energy Info */}
              <div className="flex justify-end items-center mt-2 text-white text-sm font-pixel">
                <BsFillLightningChargeFill className="text-3xl mr-2 text-[#FDAD16]" />
                <p className="text-white font-pixel text-xl mt-2">
                  {states.energy}/{maxEnergy}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Click Effects */}
        {clicks.map(click => (
          <div
            key={click.id}
            className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none animate-fadeUp"
            style={{ left: click.x, top: click.y }}
            onAnimationEnd={handleAnimationEnd(click.id)}>
            +{multiTapUpgrade?.upgrade.level}
          </div>
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
