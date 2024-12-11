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
import BoosterItemDetailModal, {
  BoosterItemDetailModalProps,
} from './BoosterItemDetailModal';
import CoinSVG from '@/assets/coin_pixel.svg';
import { PiHandTapFill } from 'react-icons/pi';
import { TUpgradeOverall } from '@/type/TUpgrade';
import useBoundStore from '@/store/store';
import { TbRecharging } from 'react-icons/tb';
import { FaBoltLightning } from 'react-icons/fa6';
import { WithoutFunctions } from '@/utils/type';
import { useEffect, useState } from 'react';
import UpgradeEnum from '@/enum/UpgradeEnum';

type ModalProps = Omit<WithoutFunctions<BoosterItemDetailModalProps>, 'isOpen'>;

const BoosterModal: React.FC<TBoosterModalProps> = ({
  isOpen,
  setIsOpen,
  upgrades,
}) => {
  const {
    game_states: { balance },
  } = useBoundStore.use.user();

  const boosterItemModalPropsValInit: ModalProps = {
    id: '',
    amount: '',
    description: '',
    name: '',
    effect: UpgradeEnum.ENERGY_LIMIT,
  };

  const [innerIsOpen, setInnerIsOpen] = useState<boolean>(false);
  const [bmipVal, setBmipVal] = useState<ModalProps>(
    boosterItemModalPropsValInit,
  );

  useEffect(() => {
    if (!innerIsOpen) {
      setBmipVal(boosterItemModalPropsValInit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerIsOpen]);

  const handleClick =
    ({ amount, description, effect, id, name }: ModalProps) =>
    () => {
      setBmipVal({ amount, description, name, effect, id });
      setInnerIsOpen(true);
    };

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
            src={CoinSVG} // Replace with actual coin image URL
            alt="Coin"
            className="w-14 h-14"
          />
          <span className="ml-4 text-2xl font-pixel">{balance}</span>
        </div>

        {/* Booster List */}
        <div className="px-6">
          {upgrades.map((upgrade, index) => {
            const {
              upgrade: { level },
              upgrade_detail: {
                id,
                description,
                base_cost,
                inc_multiplier,
                name,
                effect,
              },
            } = upgrade;

            const amount = base_cost * inc_multiplier * level;

            let upgradeIcon;
            switch (effect) {
              case UpgradeEnum.ENERGY_LIMIT:
                upgradeIcon = <FaBoltLightning className="w-9 h-9 mr-4" />;
                break;
              case UpgradeEnum.ENERGY_RECHARGE:
                upgradeIcon = <TbRecharging className="w-9 h-9 mr-4" />;
                break;
              case UpgradeEnum.MULTI_TAP:
                upgradeIcon = <PiHandTapFill className="w-9 h-9 mr-4" />;
            }

            return (
              <div
                key={index}
                className="flex items-center justify-between bg-primary-1 text-white p-4 mb-4 rounded-3xl shadow-lg active:opacity-75"
                aria-hidden
                onClick={handleClick({
                  description,
                  amount: amount.toLocaleString(),
                  name,
                  effect,
                  id,
                })}>
                {/* Booster Icon */}
                <div className="flex items-center">
                  {upgradeIcon}
                  <div className="font-inter">
                    <div className="font-semibold">
                      {upgrade.upgrade_detail.name}
                    </div>
                    <div className="flex items-center text-sm font-normal">
                      <img
                        src={CoinSVG} // Replace with coin icon
                        alt="Coin Icon"
                        className="w-4 h-4 mr-1"
                      />
                      {amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="text-white text-lg font-normal">
                  <IonIcon icon={chevronForwardOutline} className="text-3xl" />
                </div>
              </div>
            );
          })}
        </div>
      </IonContent>
      <BoosterItemDetailModal
        setIsOpen={setInnerIsOpen}
        isOpen={innerIsOpen}
        {...bmipVal}
      />
    </IonModal>
  );
};

type TBoosterModalProps = {
  upgrades: TUpgradeOverall[];
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

export default BoosterModal;
